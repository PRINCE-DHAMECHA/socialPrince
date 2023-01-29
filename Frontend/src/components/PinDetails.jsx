import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import { FaRegComment } from "react-icons/fa";
import { pinDetailQuery } from "../utils/data";
import Spinnerr from "./Spinner";
const PinDetails = ({ user }) => {
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
      });
    }
  };
  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment("");
          setAddingComment(false);
        });
    }
  };
  useEffect(() => {
    const i = setInterval(() => {
      fetchPinDetail();
    }, 5000);
    return () => {
      clearInterval(i);
    };
  }, []);
  if (!pinDetail) return <Spinnerr message="Loading pins..."></Spinnerr>;
  return (
    <div
      className="flex flex-col m-auto bg-white"
      style={{ maxWidth: "1500px", borderRadius: "32px" }}
    >
      <Link
        to={`/user-profile/${pinDetail.postedBy?._id}`}
        className="flex md:gap-5 gap-3 md:m-5 m-3 items-center bg-white rounded-lg"
      >
        <img
          className="md:w-16 md:h-16 h-12 w-12 rounded-full object-cover"
          src={pinDetail.postedBy?.image}
        ></img>
        <p className="md:text-xl text-base font-medium">
          {pinDetail.postedBy?.userName}
        </p>
      </Link>
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img
          style={{ maxHeight: "650px", maxWidth: "80%" }}
          className="rounded-t-3xl rounded-b-lg h-auto w-auto"
          src={pinDetail?.image && urlFor(pinDetail?.image).url()}
          alt="user-post"
        />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div>
          <h1 className="text-4xl font-bold break-words mt-3">
            {pinDetail.title}
          </h1>
          <p className="mt-3">{pinDetail.about}</p>
        </div>
        <div className="flex mt-7 sm:justify-between sm:flex-row flex-col-reverse justify-start">
          <div className="flex gap-5 items-center mt-5">
            <div className="gap-3 flex sm:m-auto justify-start ">
              <div className="flex gap-1 justify-center text-center">
                <FaRegComment size="32px" />
              </div>
              <h2 className="text-2xl">
                <p className="text-2xl">
                  {pinDetail?.comments?.length
                    ? pinDetail?.comments?.length
                    : 0}{" "}
                  Comment{pinDetail?.comments?.length > 1 ? "s" : ""}
                </p>
              </h2>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href={`${pinDetail.image.asset.url}?dl=`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-start justify-start text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              download
            >
              <MdDownloadForOffline size="35px"></MdDownloadForOffline>
            </a>
          </div>
        </div>
        <div className="max-h-370 overflow-y-auto">
          {pinDetail?.comments?.map((cmt, i) => (
            <div
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
              key={i}
            >
              <Link to={`/user-profile/${cmt.postedBy?._id}`}>
                <img
                  src={cmt.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                ></img>
              </Link>
              <div className="flex flex-col">
                <p className="font-bold">{cmt.postedBy.userName}</p>
                <p>{cmt.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-6 gap-3 text-center justify-center">
          <Link to={`/user-profile/${pinDetail.postedBy?._id}`}>
            <img
              className="w-8 h-8 rounded-full cursor-pointer"
              src={user.image}
            ></img>
          </Link>
          <input
            className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-500"
            type="text"
            placeholder="Add a Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></input>
          <button
            type="button"
            className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            onClick={addComment}
          >
            {addingComment ? "Posted!! Visible within a minute" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinDetails;
