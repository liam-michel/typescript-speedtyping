import axios from 'axios';
import React, {Component, useState} from 'react';



export default function UploadText({setText}: any) {
    const [file, setFile] = useState<File | null>(null);

    const checkFileExtension = (fileName: string): boolean =>{
      const split: string[] = fileName.split('.');
      const extension: string = split[split.length - 1];
      return extension === 'txt';
    }
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file: any = e.target.files ? e.target.files[0] : null;

      if (file && checkFileExtension(file.name)){
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result;
          setText(text);
          console.log(text);
        }
        reader.readAsText(file);
    }else{
      alert('Please upload a .txt file');
    }
  }
    
    return(
        <div>
            <h3>Upload your own text</h3>
            <input type = "file"
            onChange = {onFileChange}>
            </input> 
        </div>
    )
}