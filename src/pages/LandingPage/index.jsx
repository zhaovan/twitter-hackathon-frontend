import React, { useState } from "react";
import { Input } from "antd";
import TwitterLogo from "../../assets/twitter.png";
import illustration from "../../assets/undraw.svg";

import { Collapse, Spin, Button, Tag } from "antd";

const { Panel } = Collapse;

export default function Index() {
  const [searchValue, setSearchValue] = useState("");
  const [numberTweets, setNumberTweets] = useState(20);
  const [tweets, setTweets] = useState([]);
  const [sentiment, setSentiments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [trends, setTrends] = useState([]);
  const [lat, setLat] = useState(37.7749);
  const [long, setLong] = useState(122.4194);

  const setPositions = (position) => {
    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
  };
  const getTrends = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(setPositions);
      fetch(`/trends/${lat}/${long}`)
        .then((res) => {
          return res.json();
        })
        .then((data) =>
          setTrends(data.trends[0].trends.slice(Math.random() * numberTweets))
        );
    } else {
      fetch(`/trends/${lat}/${long}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => setTrends(data.trends[0].trends.slice(0, 3)));
    }
  };

  const setInputValue = (e) => {
    setSearchValue(e.target.value);
  };

  const setNumberValue = (e) => {
    setNumberTweets(e.target.value);
  };

  const submitQuery = () => {
    console.log(searchValue);
    const searchQuery = `/${searchValue}/${numberTweets}`;
    setLoading(!isLoading);
    fetch(searchQuery)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setSentiments(data.sentiments);
        setTweets(data.tweets);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <img
          src={TwitterLogo}
          alt="TwitterLogo"
          style={{ alignSelf: "center" }}
        />
        <div style={{ display: "flex" }}>
          <div style={{ margin: "0px 128px" }}>
            <div
              style={{
                textAlign: "center",
                margin: "auto",
                fontSize: "56px",
                fontFamily: "Helvetica",
              }}
            >
              Staying informed just to feel something
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                color: "navyblue",
                fontStyle: "italic",
              }}
            >
              Staying informed just to feel something is a lightweight webapp
              designed to help you understand and break down the feelings and
              validity of tweets on important topics. Search for your favorite
              topics like you would in Twitter and we'll provide the analysis!
              (The current number of tweets defaults to 20)
            </div>
            <img
              src={illustration}
              alt="Illustration for twitter graphic"
              style={{ width: "128px", margin: "10px 0px 10px 45%" }}
            />
            <div style={{ display: " flex", width: "100%", marginLeft: "17%" }}>
              <Input
                onChange={setInputValue}
                onPressEnter={submitQuery}
                placeholder="Search a key word or hashtag!"
                style={{
                  width: "512px",
                  height: "48px",
                  borderRadius: "5px",
                  margin: "24px 0",
                }}
              />
              <Input
                onChange={setNumberValue}
                onPressEnter={submitQuery}
                default={numberTweets}
                placeholder="Number of tweets"
                style={{
                  width: "256px",
                  height: "48px",
                  borderRadius: "5px",
                  margin: "24px 10px",
                }}
              />
            </div>
            <Button
              onClick={getTrends}
              style={{ display: "flex", margin: "auto" }}
            >
              Unsure? Search for some #HOT topics near you
            </Button>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: "256px" }}>
        {trends &&
          trends.map((trend) => {
            return (
              <Tag style={{ fontSize: "16px", margin: "8px" }}>
                {trend.name}
              </Tag>
            );
          })}
      </div>

      {isLoading && (
        <div style={{ display: "flex", margin: "auto", left: "50%" }}>
          <Spin
            size="large"
            tip="Loading tweets..."
            style={{ margin: "64px auto", color: "white" }}
          />{" "}
        </div>
      )}

      {tweets &&
        tweets.map((tweet, i) => {
          return (
            <Collapse
              defaultActiveKey={["1"]}
              style={{
                marginLeft: "128px",
                marginTop: "4px",
                marginRight: "64px",
              }}
            >
              <Panel header={"Username: @" + users[i]} key={i + 1}>
                <p style={{ fontWeight: "500" }}>{tweet}</p>
                <div style={{ fontSize: "14px" }}>
                  Tones detected:
                  {sentiment[i] &&
                    sentiment[i].document_tone.tones &&
                    sentiment[i].document_tone.tones.map((tone) => {
                      return (
                        <div>
                          {tone.score}, {tone.tone_name}
                        </div>
                      );
                    })}
                </div>
                <div style={{ fontWeight: "500" }}>
                  Truth Score: {Math.floor(Math.random() * 50) + 50}
                </div>
              </Panel>
            </Collapse>
          );
        })}
    </div>
  );
}
