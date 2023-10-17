// pages/index.js
import { useEffect, useState } from "react";
import { submission } from "@/schemas/submitted.schema";
import axios from "axios";
const BACKEND = "http://localhost:3001";

export default function moderation() {
  const [submissionData, setSubmissionData] = useState<submission[]>([]);

  useEffect(() => {
    getSubmissionData();
  }, []);
  const getSubmissionData = async () => {
    try {
      const response = await axios.get(`${BACKEND}/moderator/`);
      setSubmissionData(await response.data.submissions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (_id: string) => {
    console.log(_id);
    try {
      await axios.post(`${BACKEND}/moderator/approve/`, { _ID: _id });
      getSubmissionData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeny = async (_ID: string) => {
    try {
      await axios.post(`${BACKEND}/moderator/deny`, { _ID });
      getSubmissionData();
    } catch (error) {
      console.log(error);
    }
  };
  function buildTable() {
    console.log(submissionData);
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
            <th>Approve</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {submissionData &&
            submissionData.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.title}</td>
                <td>{submission.authors.join(", ")}</td>
                <td>{submission.date}</td>
                <td>{submission.journal}</td>
                <td>{submission.volume}</td>
                <td>{submission.issue}</td>
                <td>
                  {submission.pageRange[0]} - {submission.pageRange[1]}
                </td>
                <td>
                  <a
                    href={`https://doi.org/${submission.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {submission.doi}
                  </a>
                </td>
                <td>{submission.summary}</td>

                <td>
                  <button onClick={() => handleApprove(submission._id)}>
                    Approve
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeny(submission._id)}>
                    Deny
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
  let modTable = buildTable();

  return (
    <div>
      <h1>Moderation Table</h1>
      {true && modTable}
    </div>
  );
}
