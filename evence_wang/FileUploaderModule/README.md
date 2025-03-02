# FileUploader Module

The `FileUploader` module provides a widget for uploading files, with support for local storage and AWS S3 integration.

## Setup Instructions

### 1. Create a Virtual Environment

You can use `uv` (recommended) or `venv` to manage your virtual environment.

#### Using `uv`
```sh
uv venv
```

#### Using `venv`
```sh
python -m venv venv
```

### 2. Activate the Virtual Environment

#### macOS/Linux
```sh
source venv/bin/activate
```

#### Windows (cmd)
```sh
venv\Scripts\activate
```

### 3. Install Dependencies

Change into the `FileUploaderModule` directory:
```sh
cd FileUploaderModule
```

Then, install dependencies:

#### Using `uv` (Recommended)
```sh
uv pip install -r requirements.txt
```

#### Using `pip`
```sh
pip install -r requirements.txt
```

### 4. Run the FileUploader Demo

Then, start Marimo in edit mode for `drag_drop.py`:
```sh
marimo edit drag_drop.py
```

This will launch a Marimo notebook instance where you can test the `FileUploader` module.

## AWS Configuration

To use AWS S3 for file storage, you need to configure AWS credentials.

### 1. Configure AWS CLI
If you haven’t already installed AWS CLI, install it from [AWS CLI Installation Guide](https://aws.amazon.com/cli/).

Then, configure your AWS credentials by running:
```sh
aws configure
```
You will be prompted to enter the following:
- **AWS Access Key ID**: Found in the AWS Console under IAM Users.
- **AWS Secret Access Key**: Provided when creating an access key.
- **Default region name**: (e.g., `ca-central-1`, `us-east-1`, `us-west-2`)
- **Default output format**: Leave blank or enter `json`, `yaml`, `text`, etc.

### 2. Generate AWS Credentials
If you don’t have AWS credentials yet, follow these steps:
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **IAM (Identity and Access Management)**.
3. Click on **Users** in the left menu and select your user.
4. Go to the **Security Credentials** tab.
5. Click **Create access key**.
6. Copy the generated **Access Key ID** and **Secret Access Key**.
7. Use these credentials when running `aws configure`.

After setup, AWS CLI will store your credentials in `~/.aws/credentials` (Linux/macOS) or `C:\Users\USERNAME\.aws\credentials` (Windows).

## Features
- Supports multiple file uploads
- Saves files to disk
- Optionally uploads files to AWS S3
- Can be integrated into Marimo apps

## Configuration
- To enable S3 uploads, set the environment variable `S3_UPLOAD_ENABLED=1`.
- AWS credentials must be configured via `.env` file or AWS CLI.

