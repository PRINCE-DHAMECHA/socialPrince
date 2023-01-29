import React, { useState } from "react";
import { urlFor, client } from "../client";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import {
  BsArrowDownRightCircleFill,
  BsBookmarksFill,
  BsBookmarks,
} from "react-icons/bs";
import { fetchUser } from "../utils/fetchUser";
import { FaRegComment, FaBookmark } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Pin = ({ pin: { postedBy, image, _id, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();
  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };
  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };
  let alreadySaved = !!save?.filter((item) => item?.postedBy?._id === user?.sub)
    ?.length;
  return (
    <div className="m-2 my-5 bg-gray-100 p-3 rounded-lg">
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="sm:hidden flex gap-2 mb-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
        ></img>
        <p>{postedBy?.userName}</p>
      </Link>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out text-center"
      >
        <img
          className="rounded-lg m-auto"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        ></img>
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex justify-end gap-2">
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete></AiTwotoneDelete>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              {alreadySaved ? (
                <div className="flex ml-1 gap-2 bg-slate-50 rounded-lg p-2">
                  <button
                    type="button"
                    className="flex justify-between text-center opacity-70 hover:opacity-100 bg-slate-50 text-black font-bold text-base rounded-3xl outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <BsBookmarksFill></BsBookmarksFill>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                    type="button"
                    className="opacity-70 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    <BsBookmarks color="black" size="20px" />
                  </button>
                </div>
              )}
              <div className="flex">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="sm:hidden flex items-center justify-start mt-4">
        {alreadySaved ? (
          <div className="flex gap-2 bg-slate-100 rounded-lg p-2">
            <button
              type="button"
              className="flex justify-between text-center opacity-70 hover:opacity-100 bg-slate-100 text-black font-bold p-1 text-base rounded-3xl outline-none"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <BsBookmarksFill size="25px"></BsBookmarksFill>
            </button>
          </div>
        ) : (
          <div className="flex gap-2 bg-slate-100 rounded-lg p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                savePin(_id);
              }}
              type="button"
              className="opacity-70 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none"
            >
              <BsBookmarks color="black" size="25px" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <a
            href={`${image?.asset?.url}?dl=`}
            download
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
          >
            <MdDownloadForOffline size="30px" />
          </a>
        </div>
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="hidden sm:flex  gap-2 mt-4 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
        ></img>
        <p>{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
