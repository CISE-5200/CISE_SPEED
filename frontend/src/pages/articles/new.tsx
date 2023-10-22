import { FormEvent, useEffect, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
import axios from "axios";
import BACKEND_URL from "@/global";
import { article } from "@/schemas/article.schema";
import { RequestType, makeRequest, useRequest } from "@/lib/auth";
import Popup from "@/components/popup/Popup";

interface Method {
  id: string;
  name: string;
};

const NewDiscussion = () => {
  const methodsResponse = useRequest('/method/all', RequestType.GET);
  const [methods, setMethods] = useState<Method[]>();

  useEffect(() => {
    setMethods(methodsResponse.data?.methods);
  }, [methodsResponse.data]);
  
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [year, setYear] = useState<number>(1990);
  const [journal, setJournal] = useState("");
  const [source, setSource] = useState("");
  const [doi, setDoi] = useState("");
  const [method, setMethod] = useState("");
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState("");
  const [research, setResearch] = useState("");
  const [abstract, setAbstract] = useState("");
  const [participant, setParticipant] = useState("");

  const [submitMessage, setSubmitMessage] = useState<string | undefined>();
  const [submitValid, setSubmitValid] = useState<boolean>();

  const [errors, setErrors] = useState({
    title: "",
    authors: "",
    year: "",
    journal: "",
    doi: "",
    source: "",
    claim: "",
    research: "",
    participant: "",
    abstract: "",
    method: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      authors: "",
      year: "",
      journal: "",
      doi: "",
      source: "",
      claim: "",
      research: "",
      participant: "",
      abstract: "",
      method: "",
    };

    let isValid = true;

    if (title.trim() === "") {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (authors.some((author) => author.trim() === "") || authors.length < 1) {
      // Check if any author is empty
      newErrors.authors = "At least one author is required";
      isValid = false;
    }

    if (journal.trim() === "") {
      newErrors.journal = "Journal is required";
      isValid = false;
    }

    if (year < 1990) {
      newErrors.year = "Publication year must be earlier than 1990";
      isValid = false;
    }

    if (journal.trim() === "") {
      newErrors.journal = "Journal is required";
      isValid = false;
    }

    if (claim.trim() === "") {
      newErrors.claim = "Claim is required";
      isValid = false;
    }

    if (research.trim() === "") {
      newErrors.research = "Research type is required";
      isValid = false;
    }
    if (doi.trim() === "") {
      newErrors.doi = "Research type is required";
      isValid = false;
    }

    if (source.trim() === "") {
      newErrors.source = "Source is required";
      isValid = false;
    }

    if (abstract.trim() === "") {
      newErrors.abstract = "Abstract is required";
      isValid = false;
    }
    if (participant.trim() === "") {
      newErrors.participant = "Participant is required";
      isValid = false;
    }
    if (method === "") {
      newErrors.method = "Method is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    setResult("Unclear");
    event.preventDefault();
    const submissionObject: article = {
      title: title,
      authors: authors,
      journalName: journal,
      pubYear: year.toString(),
      source: source,
      DOI: doi,
      method: method,
      claim: claim,
      result: "unclear",
      researchType: research,
      abstract: abstract,
      _ID: "",
      type: "",
      participant: participant,
    };
    console.log(submissionObject);

    if (validateForm()) {
      makeRequest('/submission/submit', RequestType.POST, {
        ...submissionObject
      }).then((response) => {
        setSubmitValid(response.success);

        if(response.success) {
          setSubmitMessage("Article submitted for moderation.");
        } else {
          setSubmitMessage("Failed to submit article.");
        }
      });
    } else {
      setSubmitValid(false);
      setSubmitMessage("Form has errors. Please correct them.");
    }
  };

  // Some helper methods for the authors array
  const addAuthor = () => {
    setAuthors(authors.concat([""]));
  };
  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };
  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
  };
  // Return the full form
  return (
    <div className={formStyles.submitForm}>
      <h1 style={{ textAlign: "center" }}>
        Submit a new article in the SPEED Database
      </h1>
      {submitMessage !== undefined && (
		    <Popup message={submitMessage} success={submitValid}/>
	    )}
      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <div className={formStyles.error}>{errors.title}</div>
        <label htmlFor="title">Title:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.authors}</div>
        <label htmlFor="author">Authors:</label>
        {authors.map((author, index) => {
          return (
            <div key={`author ${index}`} className={formStyles.arrayItem}>
              <input
                type="text"
                name="author"
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
                className={formStyles.formItem}
              />
              <button
                onClick={() => removeAuthor(index)}
                className={formStyles.buttonItem}
                style={{ marginLeft: "3rem" }}
                type="button"
              >
                -
              </button>
            </div>
          );
        })}
        <button
          onClick={() => addAuthor()}
          className={formStyles.buttonItem}
          style={{ marginLeft: "auto" }}
          type="button"
        >
          +
        </button>
        <div className={formStyles.error}>{errors.year}</div>
        <label htmlFor="pubYear">Publication Year:</label>
        <input
          className={formStyles.formItem}
          type="number"
          name="pubYear"
          id="pubYear"
          value={year}
          onChange={(event) => {
            const val = event.target.value;
            if (val === "") {
              setYear(0);
            } else {
              setYear(parseInt(val));
            }
          }}
        />
        <div className={formStyles.error}>{errors.journal}</div>
        <label htmlFor="journal">Journal:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="journal"
          id="journal"
          value={journal}
          onChange={(event) => {
            setJournal(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.source}</div>
        <label htmlFor="source">Source:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.doi}</div>
        <label htmlFor="doi">DOI:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="doi"
          id="doi"
          value={doi}
          onChange={(event) => {
            setDoi(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.claim}</div>
        <label htmlFor="claim">Claim:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="claim"
          id="claim"
          value={claim}
          onChange={(event) => {
            setClaim(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.method}</div>
        <div className={formStyles.error}>{errors.claim}</div>
        <label htmlFor="method">Select Method:</label>
        <select
          className={formStyles.formItem}
          id="method"
          name="method"
          onChange={(event) => {
            setMethod(event.target.value);
          }}
        >
          <option value="">Select Method</option>
          {methods?.map((method) => (
            <option key={method.id} value={method.id}>{method.name}</option>
          ))}
        </select>
        <div className={formStyles.error}>{errors.research}</div>
        <label htmlFor="research">Research Type:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="research"
          id="research"
          value={research}
          onChange={(event) => {
            setResearch(event.target.value);
          }}
        />
        <div className={formStyles.error}>{errors.participant}</div>
        <label htmlFor="Participent">Participent:</label>
        <textarea
          className={formStyles.formTextArea}
          name="Participent"
          value={participant}
          onChange={(event) => setParticipant(event.target.value)}
        />
        <div className={formStyles.error}>{errors.abstract}</div>
        <label htmlFor="abstract">Abstract:</label>
        <textarea
          className={formStyles.formTextArea}
          name="abstract"
          value={abstract}
          onChange={(event) => setAbstract(event.target.value)}
        />
        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
