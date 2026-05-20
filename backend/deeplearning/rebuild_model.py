import os

def rebuild_file(output_path, num_chunks):
    print(f"Rebuilding {output_path} from {num_chunks} chunks...")
    with open(output_path, 'wb') as outfile:
        for i in range(num_chunks):
            chunk_name = f"{output_path}.part{i}"
            print(f"Reading {chunk_name}...")
            with open(chunk_name, 'rb') as infile:
                outfile.write(infile.read())
    
    # Optionally remove chunks to save space
    # for i in range(num_chunks):
    #     os.remove(f"{output_path}.part{i}")

    print(f"Successfully rebuilt {output_path}! Size: {os.path.getsize(output_path)} bytes.")

if __name__ == '__main__':
    # When run on Render, it runs from rootDir which is backend/deeplearning
    # So the path to the chunks is just Signature_verification(DL model).h5
    model_name = "Signature_verification(DL model).h5"
    if not os.path.exists(model_name):
        rebuild_file(model_name, 5)
    else:
        print(f"{model_name} already exists. Skipping rebuild.")
