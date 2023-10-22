import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
import axios from "axios";
import BACKEND_URL from "@/global";
import { RequestType, makeRequest } from "@/lib/auth";
import Popup from "@/components/popup/Popup";

const NewDiscussion = () => {
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

  const [submitValid, setSubmitValid] = useState<boolean>();
  const [submitMessage, setSubmitMessage] = useState<string | undefined>(undefined);

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

    setErrors(newErrors);
    return isValid;
  };

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    setResult("Unclear");
    event.preventDefault();

    if (validateForm()) {

      // Submit data

	  makeRequest('/article/submit', RequestType.POST, {
		title: title,
		authors: authors,
		journal: journal,
		year: year,
		source: source,
		doi: doi,
		method: method,
		claim: claim,
		result: result,
		researchType: research,
		abstract: abstract,
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
        <div className={formStyles.error}>{errors.title}</div>
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
        <div className={formStyles.error}>{errors.authors}</div>
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
        <div className={formStyles.error}>{errors.year}</div>
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
        <div className={formStyles.error}>{errors.journal}</div>
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
        <div className={formStyles.error}>{errors.source}</div>
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
        <div className={formStyles.error}>{errors.doi}</div>
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
          <option value="TDD">TDD</option>
          <option value="Mob Programming">Mob Progarmming</option>
          <option value="Automated Testing">Automated Testing</option>
        </select>
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
        <div className={formStyles.error}>{errors.research}</div>
        <label htmlFor="abstract">Abstract:</label>
        <textarea
          className={formStyles.formTextArea}
          name="abstract"
          value={abstract}
          onChange={(event) => setAbstract(event.target.value)}
        />
        <div className={formStyles.error}>{errors.abstract}</div>
        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
