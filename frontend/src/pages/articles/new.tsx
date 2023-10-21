import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
import axios from "axios";
import BACKEND_URL from "@/global";

const NewDiscussion = () => {
	const [title, setTitle] = useState("");
	const [authors, setAuthors] = useState<string[]>([]);
	const [year, setYear] = useState<number>(1990);
	const [journal, setJournal] = useState("");
	const [method, setMethod] = useState("");
	const [claim, setClaim] = useState("");
	const [result, setResult] = useState("");
	const [research, setResearch] = useState("");
	const [participant, setParticipant] = useState("");
	const [status, setStatus] = useState("");
	const [submitMessage, setSubmitMessage] = useState('');

	const [errors, setErrors] = useState({
		title: '',
		authors: '',
		year: '',
		journal: '',
		claim: '',
		research: '',
		participant: '',
	  });

	const validateForm = () => {
		const newErrors = {
		  title: '',
		  authors: '',
		  year: '',
		  journal: '',
		  claim: '',
		  research: '',
		  participant: '',
		};
	
		let isValid = true;
	
		if (title.trim() === '') {
		  newErrors.title = 'Title is required';
		  isValid = false;
		}
	
		if (authors.some(author => author.trim() === '')) {
			// Check if any author is empty
			newErrors.authors ='At least one author is required';
			isValid = false;
		}
	
		if (year < 1990) {
		  newErrors.year = 'Publication Year must be earlier than 1990';
		  isValid = false;
		}
	
		if (journal.trim() === '') {
		  newErrors.journal = 'Journal is required';
		  isValid = false;
		}
	
		if (claim.trim() === '') {
		  newErrors.claim = 'Claim is required';
		  isValid = false;
		}
	
		if (research.trim() === '') {
		  newErrors.research = 'Research Type is required';
		  isValid = false;
		}
	
		if (participant.trim() === '') {
		  newErrors.participant = 'Research Participant Type is required';
		  isValid = false;
		}
	
		setErrors(newErrors);
		return isValid;
	};
	
	
	const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
		setResult("Unclear");
		setStatus("Submitted");
		event.preventDefault();
		console.log(
			JSON.stringify({
				title,
				authors,
				year,
				journal,
				method,
				claim,
				result,
				research,
				participant,
			})
		);

		if (validateForm()) {
			console.log('Form is valid and can be submitted');
			setSubmitMessage('Article submitted for moderation.');
			// Submit data
			axios.post(`${BACKEND_URL}/article/submit`, {
				title: title,
				authors: authors,
				year: year,
				journal: journal,
				method: method,
				claim: claim,
				result: result,
				researchType: research,
				participant: participant,
				status: status,
	
			}).then((response) => {
				let data = response.data;
			});
			setTimeout(() => {
				//reset submitted message
				setSubmitMessage('');
			  }, 3000); // Hide the message after 3 seconds
		} else {
			console.log('Form has errors. Please correct them.');
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
		<div className="container">
			<h1>New Article</h1>
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
							<input type="text" name="author" value={author} onChange={(event) => changeAuthor(index, event.target.value)} className={formStyles.formItem} />
							<button onClick={() => removeAuthor(index)} className={formStyles.buttonItem} style={{ marginLeft: "3rem" }} type="button">
								-
							</button>
						</div>
					);
				})}
				<button onClick={() => addAuthor()} className={formStyles.buttonItem} style={{ marginLeft: "auto" }} type="button">
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
				<select id="method" name="method" onChange={(event) => {setMethod(event.target.value)}}>
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
				<label htmlFor="participant">Reseach Participant type:</label>
				<input
					className={formStyles.formItem}
					type="text"
					name="participant"
					id="participant"
					value={participant}
					onChange={(event) => {
						setParticipant(event.target.value);
					}}
				/>
				<div className={formStyles.error}>{errors.participant}</div>
				<button className={formStyles.formItem} type="submit">
					Submit
				</button>
				<div>{submitMessage}</div>
			</form>
		</div>
	);
};

export default NewDiscussion;