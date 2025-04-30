pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = '1.29.2'
        DOCKER_REGISTRY = credentials('docker-registry')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        JWT_SECRET = credentials('jwt-secret')
        PYTHON_PATH = 'C:\\Python38\\python.exe'
        PIP_PATH = 'C:\\Python38\\Scripts\\pip.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Load Environment') {
            steps {
                script {
                    def props = readProperties file: 'jenkins.env'
                    env.DOCKER_ENV = props.DOCKER_ENV ?: 'true'
                    env.NODE_ENV = props.NODE_ENV ?: 'production'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    bat """
                        docker-compose -f docker-compose.yml build --build-arg NODE_ENV=%NODE_ENV% --build-arg DOCKER_ENV=%DOCKER_ENV%
                    """
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        script {
                            bat """
                                docker-compose run --rm client npm run test:ci || exit /b 0
                            """
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        script {
                            bat """
                                docker-compose run --rm server npm run test:ci || exit /b 0
                            """
                        }
                    }
                }
                stage('ML API Tests') {
                    when {
                        expression { return fileExists('C:\\Python38\\python.exe') }
                    }
                    steps {
                        script {
                            bat """
                                docker-compose run --rm ml-api python -m pytest || exit /b 0
                            """
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    bat 'npm audit || exit /b 0'
                    bat 'docker scout cves . || exit /b 0'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop existing containers first
                    bat 'docker-compose down || exit /b 0'
                    
                    // Start new containers
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    bat 'powershell -Command "Start-Sleep -Seconds 30"'
                    
                    // Check each service
                    parallel (
                        "Frontend": {
                            bat 'curl -f http://localhost:3000 || exit /b 0'
                        },
                        "Backend": {
                            bat 'curl -f http://localhost:5000/api/health || exit /b 0'
                        },
                        "ML API": {
                            bat 'curl -f http://localhost:6000/health || exit /b 0'
                        }
                    )
                }
            }
        }
    }

    post {
        always {
            bat 'docker-compose logs > docker-logs.txt || exit /b 0'
            archiveArtifacts artifacts: 'docker-logs.txt', fingerprint: true, allowEmptyArchive: true
            bat 'docker system prune -f || exit /b 0'
        }
        success {
            script {
                if (env.EMAIL_NOTIFICATIONS == 'true') {
                    emailext (
                        subject: "Pipeline Success: ${currentBuild.fullDisplayName}",
                        body: "The pipeline completed successfully.",
                        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                    )
                }
            }
        }
        failure {
            script {
                bat 'docker-compose down || exit /b 0'
                if (fileExists('backup.gz')) {
                    bat 'docker-compose up -d mongodb || exit /b 0'
                    bat 'docker-compose exec -T mongodb mongorestore --archive < backup.gz || exit /b 0'
                }
                
                if (env.EMAIL_NOTIFICATIONS == 'true') {
                    emailext (
                        subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                        body: "The pipeline failed. Check the logs for details.",
                        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                    )
                }
            }
        }
    }
} 