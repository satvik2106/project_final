import os

def split_file(input_path, chunk_size=49 * 1024 * 1024):
    file_size = os.path.getsize(input_path)
    print(f"Splitting {input_path} ({file_size} bytes) into {chunk_size} byte chunks...")

    with open(input_path, 'rb') as f:
        chunk_num = 0
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            chunk_name = f"{input_path}.part{chunk_num}"
            with open(chunk_name, 'wb') as chunk_file:
                chunk_file.write(chunk)
            
            print(f"Created {chunk_name}")
            chunk_num += 1

if __name__ == '__main__':
    split_file('backend/deeplearning/Signature_verification(DL model).h5')
