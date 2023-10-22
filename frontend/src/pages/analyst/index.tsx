// pages/index.js
import { ChangeEvent, useEffect, useState } from "react";
import { article } from "@/schemas/article.schema";
import axios from "axios";
import "../../styles/globals.scss";
import { RequestType, useRequest } from "@/lib/auth";
import BACKEND_URL from "@/global";

interface Method {
  id: string;
  name: string;
}

export default function analyst() {
  const [submissionData, setSubmissionData] = useState<article[]>([]);
  const [moderationSection, setModerationSection] = useState(true);
  const [selectedPage, setSelectedPage] = useState<article>();

  const methodsResponse = useRequest('/method/all', RequestType.GET);
  const [methods, setMethods] = useState<Method[]>();

  useEffect(() => {
    setMethods(methodsResponse.data?.methods);
  }, [methodsResponse.data]);

  useEffect(() => {
    getSubmissionData();
  }, []);

  const getSubmissionData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analyst/`);
      setSubmissionData(await response.data.submissions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (_id: string) => {
    try {
      console.log({ ...selectedPage });
      await axios.post(`${BACKEND_URL}/analyst/submit/`, { ...selectedPage });
      getSubmissionData();
      setModerationSection(true);
      setSelectedPage(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnalyse = async (_ID: string) => {
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
              <th>Journal Name</th>
              <th>Publication Year</th>
              <th>Source</th>
              <th>DOI</th>
              <th>Method</th>
              <th>Claim</th>
              <th>Result</th>
              <th>Research Type</th>
              <th>Abstract</th>
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
                    <button onClick={() => handleAnalyse(submission._ID)}>
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

  function buildReviewTable() {
    if (!selectedPage) return <div>no table selected</div>;
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        title: e.target.value,
      });
    };

    // Event handler for editing the authors
    const handleAuthorsChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        authors: e.target.value.split(", "),
      });
    };

    // Event handler for editing the journal name
    const handleJournalNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        journalName: e.target.value,
      });
    };

    // Event handler for editing the publication year
    const handlePubYearChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        pubYear: e.target.value,
      });
    };

    // Event handler for editing the source
    const handleSourceChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        source: e.target.value,
      });
    };

    // Event handler for editing the DOI
    const handleDOIChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        DOI: e.target.value,
      });
    };

    // Event handler for editing the method
    const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedPage({
        ...selectedPage,
        method: e.target.value,
      });
    };

    // Event handler for editing the claim
    const handleClaimChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        claim: e.target.value,
      });
    };

    // Event handler for editing the result
    const handleResultChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        result: e.target.value,
      });
    };

    // Event handler for editing the research type
    const handleResearchTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedPage({
        ...selectedPage,
        researchType: e.target.value,
      });
    };

    // Event handler for editing the abstract
    const handleAbstractChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setSelectedPage({
        ...selectedPage,
        abstract: e.target.value,
      });
    };
    return (
      <>
        <div className="reviewTable">
          <div className="headerTop">Title:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.title}
            onChange={handleTitleChange}
          />

          <div className="header">Authors:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.authors.join(", ")}
            onChange={handleAuthorsChange}
          />

          <div className="header">Journal Name:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.journalName}
            onChange={handleJournalNameChange}
          />

          <div className="header">Publication Year:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.pubYear}
            onChange={handlePubYearChange}
          />

          <div className="header">Source:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.source}
            onChange={handleSourceChange}
          />

          <div className="header">DOI:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.DOI}
            onChange={handleDOIChange}
          />

          <div className="header">Method:</div>
          <select
            className="analystInput"
            id="method"
            name="method"
            onChange={handleMethodChange}
            defaultValue={selectedPage.method}
          >
            {methods?.map((method) => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
        </select>

          <div className="header">Claim:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.claim}
            onChange={handleClaimChange}
          />

          <div className="header">Result:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.result}
            onChange={handleResultChange}
          />

          <div className="header">Research Type:</div>
          <input
            type="text"
            className="analystInput"
            value={selectedPage.researchType}
            onChange={handleResearchTypeChange}
          />

          <div className="header">Abstract:</div>
          <textarea
            className="analystInput"
            value={selectedPage.abstract}
            onChange={handleAbstractChange}
          />
        </div>

        <br />
        <div className="buttonsSection">
          <button
            onClick={() => handleApprove(selectedPage._ID)}
            className="reviewButton"
          >
            Submit
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
