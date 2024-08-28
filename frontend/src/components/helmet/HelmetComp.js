import React from "react";
import { Helmet } from "react-helmet";

export default function HelmetComp(props) {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
        <meta name="description" content={props.content} />
        <link rel="canonical" href={props.url} />
      </Helmet>
    </>
  );
}
