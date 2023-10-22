// pages/index.js
import { useEffect, useState } from "react";
import { submission } from "@/schemas/submitted.schema";
import axios from "axios";
import "../../styles/globals.scss";
import BACKEND_URL from "@/global";

export default function moderation() {
  const [submissionData, setSubmissionData] = useState<submission[]>([]);
  const [moderationSection, setModerationSection] = useState(true);
  const [selectedPage, setSelectedPage] = useState<submission>();
  const [similarItems, setSimilarItems] = useState<submission[]>([]);

  useEffect(() => {
    getSubmissionData();
  }, []);
  useEffect(() => {
    buildSimilarTable();
  }, [selectedPage]);

  const getSubmissionData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/moderator/`);
      setSubmissionData(await response.data.submissions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (_id: string) => {
    try {
      await axios.post(`${BACKEND_URL}/moderator/approve/`, { _ID: _id });
      getSubmissionData();
      setModerationSection(true);
      setSelectedPage(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeny = async (_ID: string) => {
    try {
      await axios.post(`${BACKEND_URL}/moderator/deny`, { _ID });
      getSubmissionData();
      setModerationSection(true);
      setSelectedPage(undefined);
    } catch (error) {
      console.log(error);
    }
  };
  const handleReview = async (_ID: string) => {
    const selected = submissionData.find((p) => p._ID === _ID);
    setSelectedPage(await selected);
    setModerationSection(false);
  };
  function buildTable() {
    if (submissionData) {
      return (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Date</th>
              <th>Journal</th>
              <th>Volume</th>
              <th>Issue</th>
              <th>Page Range</th>
              <th>DOI</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {submissionData &&
              submissionData.map((submission) => (
                <tr key={submission._ID}>
                  <td>{submission.title}</td>
                  <td>{submission.authors.join(", ")}</td>
                  <td>{submission.journalName}</td>
                  <td>{submission.pubYear}</td>
                  <td>{submission.source}</td>
                  <td>
                    <a
                      href={`https://doi.org/${submission.DOI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {submission.DOI}
                    </a>
                  </td>
                  <td>{submission.method}</td>
                  <td>{submission.claim}</td>
                  <td>{submission.result}</td>
                  <td>{submission.researchType}</td>
                  <td>{submission.abstract}</td>

                  <td>
                    <button onClick={() => handleReview(submission._ID)}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    } else {
      <div>No Articles to Moderate, check again later</div>;
    }
  }
  async function buildSimilarTable() {
    if (!selectedPage) return;

    try {
      const response = await axios.get(`${BACKEND_URL}/moderator/similar/`, {
        params: { title: selectedPage.title, doi: selectedPage.DOI },
      });
      console.log("similar items:", response.data);
      setSimilarItems(response.data);
    } catch (error) {
      console.error("Failed to fetch similar items:", error);
    }
  }

  function SimilarItemsTable() {
    if (!similarItems.length) return <div>No Similar Submissions found</div>;

    return (
      <div className="similarList">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Journal</th>
              <th>DOI</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {similarItems &&
              similarItems.map((item) => (
                <tr key={item._ID}>
                  <td>{item.title}</td>
                  <td>{item.authors.join(", ")}</td>
                  <td>{item.journalName}</td>
                  <td>
                    <a
                      href={`https://doi.org/${item.DOI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.DOI}
                    </a>
                  </td>
                  <td>{item.type}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  function buildReviewTable() {
    if (!selectedPage) return <div>no table selected</div>;
    return (
      <>
        <div className="flexBox">
          <div className="reviewTable">
            <ul className="headerTop">Title:</ul>
            <ul>{selectedPage.title}</ul>
            <ul className="header">Authors:</ul>
            <ul>{selectedPage.authors.join(", ")}</ul>
            <ul className="header">Journal Name:</ul>
            <ul>{selectedPage.journalName}</ul>
            <ul className="header">Publication Year:</ul>
            <ul>{selectedPage.pubYear}</ul>
            <ul className="header">Source:</ul>
            <ul>{selectedPage.source}</ul>
            <ul className="header">DOI:</ul>
            <ul>{selectedPage.DOI}</ul>
            <ul className="header">Method:</ul>
            <ul>{selectedPage.method}</ul>
            <ul className="header">Claim:</ul>
            <ul>{selectedPage.claim}</ul>
            <ul className="header">Result:</ul>
            <ul>{selectedPage.result}</ul>
            <ul className="header">Research Type:</ul>
            <ul>{selectedPage.researchType}</ul>
            <ul className="header">Abstract:</ul>
            <ul>{selectedPage.abstract}</ul>
          </div>
          {SimilarItemsTable()}
          <br />
        </div>
        <div className="buttonsSection">
          <button
            onClick={() => handleApprove(selectedPage._ID)}
            className="reviewButton"
          >
            Approve
          </button>
          <button
            onClick={() => handleDeny(selectedPage._ID)}
            className="reviewButton"
          >
            Deny
          </button>
        </div>
      </>
    );
  }
  let modTable = buildTable();
  let reviewView = buildReviewTable();
  return (
    <div>
      <br></br>
      <button onClick={() => setModerationSection(true)}>Queue</button>
      <button onClick={() => setModerationSection(false)}>
        Article Review
      </button>
      {(moderationSection && modTable) || reviewView}
    </div>
  );
}
