import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import { FaRegSadTear } from "react-icons/fa";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinnerr from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  useEffect(() => {
    setLoading(true);
    const i = setInterval(() => {
      if (categoryId) {
        const query = searchQuery(categoryId);
        client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        });
      } else {
        client.fetch(feedQuery).then((data) => {
          setPins(data);
          setLoading(false);
        });
      }
    }, 5000);
    return () => {
      clearInterval(i);
    };
  }, []);
  if (loading)
    return (
      <>
        <Spinnerr
          message="We're processing your request"
          message2="Changes will be visible within a minute."
        />
      </>
    );
  if (!pins?.length)
    return (
      <div className="flex flex-col mt-20 justify-center text-center">
        <h1 className="text-4xl">No Pins Available!!</h1>
        <div className="text-center m-auto mt-5">
          <FaRegSadTear size="40px"></FaRegSadTear>
        </div>
      </div>
    );
  return <div>{pins && <MasonryLayout pins={pins}></MasonryLayout>}</div>;
};

export default Feed;
