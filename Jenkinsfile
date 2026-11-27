
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Starting GitHub checkout...'

                checkout scm

                sh '''
                    echo "GitHub checkout successful!"
                    git rev-parse --short HEAD
                    ls -la
                '''
            }
        }

        stage('Environment') {
            steps {
                echo 'Checking Node.js environment...'

                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing project dependencies...'

                sh 'npm ci'
            }
        }

        stage('Code Lint') {
            steps {
                echo 'Running ESLint...'

                sh 'npm run lint'
            }
        }
    }

    post {
        success {
            echo 'Software_test CI Pipeline SUCCESS!'
        }

        failure {
            echo 'Software_test CI Pipeline FAILED!'
        }
    }
}
