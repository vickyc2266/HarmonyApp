import React from "react";
import { FileUploader } from "react-drag-drop-files";
import "../css/fileUploader.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function DragDrop({
  filesReceiver,
  fileTypes = ["pdf", "csv", "xlsx", "docx"],
}) {
  return (
    <FileUploader
      children={
        <>
          <UploadFileIcon sx={{ width: "2rem", height: "2rem" }} />
          <div>
            <p>
              <u>Upload</u> or drag and drop any <b>pdf, csv, docx or xlsx</b>{" "}
              file here
            </p>
          </div>
        </>
      }
      classes="drop_zone"
      multiple={true}
      handleChange={filesReceiver}
      name="file"
      types={fileTypes}
    />
  );
}

export default DragDrop;
