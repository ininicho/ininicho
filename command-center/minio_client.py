import os
from minio import Minio


def get_client() -> Minio:
    return Minio(
        os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
        secure=False,
    )


def download_object(bucket: str, object_name: str, dest_path: str) -> None:
    client = get_client()
    client.fget_object(bucket, object_name, dest_path)
