"use client";
import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import DropzoneComponent from "react-dropzone";
import { toast } from "react-toastify";

const Dropzone = () => {
  const maxsize = 20971520;
const [loading,setLoading]= useState(false);
const [uploading,setUploading] = useState(false);
const {isLoaded,isSignedIn,user}= useUser();

const notify = () => toast("Uploading");

const onDrop =(acceptedFile:File[])=>{
    acceptedFile.forEach((file)=>{
        const reader = new FileReader();
        reader.onabort=()=>console.log('file reading was aborted');
        reader.onerror = ()=>console.log('file reading has failed');
        reader.onload=async()=>{
            await uploadPost(file);
        };
        reader.readAsArrayBuffer(file);
    })
}

const uploadPost = async(selectedfile:File)=>{

  notify();

if(loading) return;
if(!user) return;
setLoading(true);

const docRef = await addDoc(collection(db,"users",user.id,"files"),{
    userId:user.id,
    filename:selectedfile.name,
    fullName:user.fullName,
    profileImg:user.imageUrl,
    timestamp:serverTimestamp(),
    type:selectedfile.type,
    size:selectedfile.size,
})

const imageRef = ref(storage,`users/${user.id}/files/${docRef.id}`);

 uploadBytes(imageRef,selectedfile).then(async(snapshot)=>{
    const downloadURL = await getDownloadURL(imageRef)

    await updateDoc(doc(db,"users",user.id,"files",docRef.id),{
        downloadURL:downloadURL,
    })
 })

setLoading(false);

}

  return (
    <DropzoneComponent
      minSize={0}
      maxSize={maxsize}
      onDrop={onDrop}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileSizeTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxsize;
        return (
          <section>
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-32 flex justify-center items-center p-5 border border-dashed rounded-lg  mt-2 ",
                isDragActive
                  ? "bg-[#035FFE] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              {!isDragActive && "Click here or drop a file to upload"}
              {isDragActive && !isDragReject && "Drop to upload this file"}
              {isDragReject && "File type not accepted,sorry!"}
              {isFileSizeTooLarge && (
                <div className="text-danger mt-2">File is too large.</div>
              )}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
};

export default Dropzone;
