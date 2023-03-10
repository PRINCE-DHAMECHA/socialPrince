import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinnerr from "./Spinner";

import { categories } from "../utils/data";
import { Spinner } from "react-bootstrap";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();
  const savePin = () => {
    if (title && about && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/webp"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setWrongImageType(true);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p
          className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in
          "
        >
          Please Fill In All The Fields
        </p>
      )}
      <div className="flex flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        {user && (
          <div className="flex gap-2 mb-5 ml-5 items-center text-left self-start bg-white rounded-lg">
            <img
              src={user.image}
              className="w-10 h-10 rounded-full"
              alt="user-image"
            ></img>
            <p className="font-bold">{user.userName}</p>
          </div>
        )}
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-4 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinnerr></Spinnerr>}
            {wrongImageType && <p className="red">Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload></AiOutlineCloudUpload>
                    </p>
                    <p className="text-lg">Click To Upload</p>
                  </div>
                  <p className="mt-32 text-gray-600 text-center">
                    Use High-quality JPG, SVG, PNG, GIF or TIFF Less Than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                ></input>
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-image"
                  className="h-full w-full"
                ></img>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete></MdDelete>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-black text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2"
          ></input>
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Caption goes here..."
            className="outline-none text-xl font-bold border-b-2 border-gray-200 p-2"
          ></input>
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl ">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-3 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.name}
                    className="text-base outline-none capitalize border-0 bg-white text-black"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center items-center mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
