# Documentation Deployment
Deploying a React App on Azure Using Container Registry and Web App with Automatic Container Pull

## Prerequisites
- Azure subscription (Azure for Students used in this example)
- Azure Container Registry (ACR)
- Azure Web App for Containers
- GitHub repository with your React app
- GitHub Actions for CI/CD

## Step-by-Step Guide

### Step 1: Create an Azure Container Registry
1. Navigate to Azure Portal and go to **Container Registries**.
2. Click on **Create**.
3. Fill in the required details:
   - **Subscription**: Azure for Students
   - **Resource group**: `cashflow`
   - **Registry name**: Choose a unique name, e.g., `recashflow`
   - **Location**: East US
   - **Pricing tier**: Basic
4. Click **Review + create** and then **Create**.

![Screenshot 2024-07-09 142257](https://github.com/Potestas06/CashFlow/assets/94400853/cc505583-1ed8-47bc-a7d2-a67a2d50f7da)


### Step 2: Configure Access Keys for ACR
1. Once the ACR is created, go to the registry and navigate to **Settings** > **Access keys**.
2. Enable **Admin user** and note down the **Username** and **Password**.

![Screenshot 2024-07-09 142339](https://github.com/Potestas06/CashFlow/assets/94400853/2dffbffa-c65e-42ab-b5da-01b3580a8f0d)


### Step 3: Create an Azure Web App for Containers
1. Navigate to **App Services** in Azure Portal and click **Create**.
2. Fill in the required details:
   - **Subscription**: Azure for Students
   - **Resource Group**: `Cashflow`
   - **Name**: Choose a unique name, e.g., `cashflowwep`
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Region**: East US
3. Click **Review + create** and then **Create**.

![Screenshot 2024-07-09 142446](https://github.com/Potestas06/CashFlow/assets/94400853/4c1ca81e-5757-4ab2-a606-cb509dd3360a)


### Step 4: Configure Deployment Center for Web App
1. Go to the created Web App (`cashflowwep`) and navigate to **Deployment Center**.
2. Select **Azure Container Registry** as the source.
3. Use **Admin Credentials** for authentication.
4. Select your ACR (`recashflow`) and specify the image name (`sampleapp`) and tag (`latest`).


![Screenshot 2024-07-09 142604](https://github.com/Potestas06/CashFlow/assets/94400853/c1222f80-37a9-4127-87b0-e26e2797571a)

### Step 5: Set Up GitHub Actions for CI/CD
1. In the GitHub repository, create a file `.github/workflows/main.yaml` with the following content:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

env:
  IMAGE_NAME: recashflow.azurecr.io/sampleapp:latest

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Create firebase.js file
        run: |
          echo "import { initializeApp } from 'firebase/app';" > src/firebase.js
          echo "import { getAuth } from 'firebase/auth';" >> src/firebase.js
          echo "import { getFirestore } from 'firebase/firestore';" >> src/firebase.js
          echo "import { getStorage } from 'firebase/storage';" >> src/firebase.js
          echo "const firebaseConfig = ${FIREBASE_CONFIG};" >> src/firebase.js
          echo "const app = initializeApp(firebaseConfig);" >> src/firebase.js
          echo "const auth = getAuth(app);" >> src/firebase.js
          echo "const db = getFirestore(app);" >> src/firebase.js
          echo "const storage = getStorage(app);" >> src/firebase.js
          echo "export { auth, db, storage };" >> src/firebase.js
        env:
          FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}

      - name: Build the application
        run: npm run build

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:latest .
          docker push ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Log in to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
          
      - name: Deploy to Azure Container Instance
        uses: azure/aci-deploy@v1
        with:
          resource-group: ${{ secrets.RESOURCE_GROUP }}
          dns-name-label: myapp-${{ github.run_number }}
          image: ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:latest
          registry-login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }}
          registry-username: ${{ secrets.REGISTRY_USERNAME }}
          registry-password: ${{ secrets.REGISTRY_PASSWORD }}
          name: cashflow
          location: 'westus'
          ports: |
            80
            443
          environment-variables: |
            NODE_ENV=production
          command: '["serve", "-s", "build", "-l", "80"]'
```
### Step 6: Dockerfile for the React App
1. Create a Dockerfile in the root of the repository:
```dockerfile
FROM node:latest
WORKDIR /cashflow
COPY . /cashflow
RUN npm install -g serve
RUN npm install
RUN npm run build  # Ensure the build step is included if needed
CMD ["serve", "-s", "build", "-l", "80"]
EXPOSE 80
EXPOSE 443
```

### Summary
By following the steps above, you have set up a CI/CD pipeline that automatically builds and deploys the React application to Azure using a container registry and a web app. This setup ensures that every push to the main branch triggers the workflow, builds the Docker image, pushes it to ACR, and deploys the updated image to your Azure Web App.
