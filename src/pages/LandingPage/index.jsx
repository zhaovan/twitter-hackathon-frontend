import React, { useState } from "react";
import { Input } from "antd";
import TwitterLogo from "../../assets/twitter.png";

import { Collapse, Spin } from "antd";

const { Panel } = Collapse;

export default function Index() {
  const [searchValue, setSearchValue] = useState("");
  const [tweets, setTweets] = useState([]);
  const [sentiment, setSentiments] = useState([]);
  const [links, setLinks] = useState([]);
  const [users, setUsers] = useState([]);

  const setInputValue = (e) => {
    setSearchValue(e.target.value);
  };

  const submitQuery = () => {
    // console.log(isLoading);
    const searchQuery = `/${searchValue}`;
    fetch(searchQuery)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setLinks(data.links);
        setSentiments(data.sentiments);
        setTweets(data.tweets);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <img src={TwitterLogo} alt="TwitterLogo" />
        <div style={{ margin: "auto", width: "512px" }}>
          <div
            style={{ textAlign: "center", margin: "auto", fontSize: "56px" }}
          >
            Feelin' Twitter
          </div>
          <div>
            Feelin' Twitter is a small webapp designed to help you understand
            and break down the feelings and validity of tweets on important
            topics. Search for your favorite topics like you would in Twitter
            and we'll provide the links and the analysis!
          </div>

          <Input
            onChange={setInputValue}
            onPressEnter={submitQuery}
            placeholder="Find a hashtag or person to follow and keep track of what they're tweeting"
            style={{
              width: "512px",
              height: "48px",
              borderRadius: "5px",
              margin: "24px 0",
            }}
          />
        </div>
      </div>

      {/* {isLoading && <Spin />} */}

      <Collapse defaultActiveKey={["1"]}>
        {tweets &&
          tweets.map((tweet, i) => {
            const link = "https://" + links[i];
            return (
              <Panel header={"Username:" + users[i]} key={i + 1}>
                <p>{tweet}</p>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Link to the actual tweet: {links[i]}
                </a>
                <div>
                  Tones detected:
                  {sentiment[i].document_tone.tones &&
                    sentiment[i].document_tone.tones.map((tone) => {
                      return (
                        <div>
                          {tone.score}, {tone.tone_name}
                        </div>
                      );
                    })}
                </div>
              </Panel>
            );
          })}
      </Collapse>
    </div>
  );
}
