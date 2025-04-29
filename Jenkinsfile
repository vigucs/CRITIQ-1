pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = '1.29.2'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('client') {
                            sh 'docker-compose run --rm client npm test'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('server') {
                            sh 'docker-compose run --rm server npm test'
                        }
                    }
                }
                stage('ML API Tests') {
                    steps {
                        dir('ml-api') {
                            sh 'docker-compose run --rm ml-api python -m pytest'
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep 30 // Wait for services to start
                    sh 'curl -f http://localhost:3000 || exit 1'
                    sh 'curl -f http://localhost:5000/health || exit 1'
                    sh 'curl -f http://localhost:6000/health || exit 1'
                }
            }
        }
    }

    post {
        always {
            sh 'docker-compose logs'
        }
        failure {
            sh 'docker-compose down'
        }
    }
} 