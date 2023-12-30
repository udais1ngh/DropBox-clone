import Dropzone from "@/components/Dropzone";
import TableWrapper from "@/components/TableWrapper";
import { db } from "@/firebase";
import { FileType } from "@/typings";
import { auth } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";

const Page = async () => {
  const { userId } = auth();
  const docResults = await getDocs(collection(db, "users", userId!, "files"));

  const skeltonFiles: FileType[] = docResults.docs.map((doc) => ({
    id: doc.id,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    fullname: doc.data().fullName,
    downloadURL: doc.data().downloadURL,
    type: doc.data().type,
    size: doc.data().size,
  }));

  console.log(skeltonFiles);
  return (
    <div className="border-t">
      <Dropzone />
      <section className="container space-y-5 mb-3 ">
        <h2 className="font-bold">All files</h2>
        <div >
        <TableWrapper skeleton={skeltonFiles}/>
        </div>
      </section>
    </div>
  );
};

export default Page;
