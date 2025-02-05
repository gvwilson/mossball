import base64

def refresh_buckets(self):
    """
    Refresh list of S3 buckets
    """
    try:
        response = self.s3.list_buckets()
        self.s3_buckets = [b['Name'] for b in response['Buckets']]
    except Exception as e:
        print(f"Error fetching buckets: {e}")
        self.s3_buckets = []

def create_bucket(self, bucket_name):
    """
    Create S3 bucket given a name
    """
    try:
        self.s3.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={
                'LocationConstraint': self.s3.meta.region_name
            }
        )
        self._refresh_buckets()
        return True
    except self.s3.exceptions.BucketAlreadyExists:
        print(f"Bucket {bucket_name} already exists")
        return False
    except Exception as e:
        print(f"Error creating bucket {bucket_name}: {e}")
        return False

def upload_to_s3(self, file_data, bucket_name):
    """
    Upload file to S3 bucket
    """
    if not self.s3_enabled:
        return

    bucket_name = self.selected_bucket or self.new_bucket_name
    if not bucket_name:
        raise ValueError("No bucket selected or specified")

    # Create bucket if a new bucket name is provided
    if not self.selected_bucket and self.new_bucket_name:
        if not self._create_bucket(self.new_bucket_name):
            raise RuntimeError("Failed to create bucket")
        bucket_name = self.new_bucket_name

    # Get file content
    content = (base64.b64decode(file_data["content"])
               if file_data["content"]
               else open(file_data["path"], "rb").read())

    try:
        self.s3.put_object(
            Bucket=bucket_name,
            Key=file_data["name"],
            Body=content,
            ContentType=file_data.get("type", "application/octet-stream")
        )
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        raise
