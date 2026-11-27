
pipeline {
    agent any

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

                    echo "Current commit:"
                    git rev-parse --short HEAD

                    echo "Project files:"
                    ls -la

                    echo "Checking project files..."
                    test -f package.json
                    test -f README.md

                    echo "Project files check passed!"
                '''
            }
        }

        stage('Project Info') {
            steps {
                echo 'Software_test project detected!'

                sh '''
                    echo "Project name:"
                    grep '"name"' package.json | head -1
                '''
            }
        }
    }

    post {
        success {
            echo 'GitHub CI Pipeline SUCCESS!'
        }

        failure {
            echo 'GitHub CI Pipeline FAILED!'
        }
    }
}
