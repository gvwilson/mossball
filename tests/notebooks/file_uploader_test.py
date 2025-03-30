import marimo

__generated_with = "0.11.31"
app = marimo.App(width="medium")


@app.cell
def _(__file__):
    import sys
    import os

    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))
    return os, sys


@app.cell
def _():
    import boto3
    from moto import mock_aws

    mock = mock_aws()
    mock.start()
    conn = boto3.resource("s3", region_name="us-east-1")
    conn.create_bucket(Bucket="mybucket")
    return boto3, conn, mock, mock_aws


@app.cell
def _():
    from evence_wang.FileUploaderModule.FileUploader import FileUploader

    uploader = FileUploader(multiple=True, to_disk=True, cloud_only=True)

    uploader
    return FileUploader, uploader


@app.cell
def _(uploader):
    uploader.contents(2, True)
    return


if __name__ == "__main__":
    app.run()
