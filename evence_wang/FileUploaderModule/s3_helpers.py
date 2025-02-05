import base64

def refresh_buckets(self):
    """
    Refresh list of S3 buckets
    """
    try:
        response = self.s3.list_buckets()
        self.s3_buckets = [b['Name'] for b in response['Buckets']]
        return True, ''
    except Exception as e:
        err = f'Error fetching buckets: {e}'
        self.s3_buckets = []
        return False, err

def create_bucket(self, bucket_name):
    """
    Create S3 bucket given a name
    """
    try:
        self.s3.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={
                'LocationConstraint': 'ca-central-1',
            }
        )
        self._refresh_buckets()
        return True, ''
    except Exception as e:
        err = f'Error creating bucket {bucket_name}: {e}'
        return False, err

def upload_to_s3(self, file_data, bucket_name):
    """
    Upload file to S3 bucket
    """
    if not self.s3_enabled:
        return

    if not bucket_name:
        raise ValueError("No bucket selected or specified")

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


def delete_from_s3(self, file_name, bucket_name):
    """
    Delete a file from S3 bucket
    """
    if not self.s3_enabled:
        return False

    try:
        self.s3.delete_object(
            Bucket=bucket_name,
            Key=file_name
        )
        return True
    except Exception as e:
        print(f"Error deleting {file_name} from S3 bucket {bucket_name}: {e}")
        return False


def get_from_s3(self, file_names, bucket_name=None):
    """
    Retrieve file content from S3 bucket
    """
    if not self.s3_enabled:
        raise ValueError("S3 is not enabled")

    bucket_name = bucket_name or self.selected_bucket
    if not bucket_name:
        raise ValueError("No bucket selected or specified")

    if isinstance(file_names, str):
        try:
            response = self.s3.get_object(Bucket=bucket_name, Key=file_names)
            return response['Body'].read()
        except Exception as e:
            print(f"Error retrieving {file_names} from S3: {e}")
            return None

    contents = []
    for file_name in file_names:
        try:
            response = self.s3.get_object(Bucket=bucket_name, Key=file_name)
            contents.append(response['Body'].read())
        except Exception as e:
            print(f"Error retrieving {file_name} from S3: {e}")
            contents.append(None)

    return contents
