import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
//import { useForm } from "react-hook-form";
//import { yupResolver } from "@hookform/resolvers/yup";
//import * as Yup from "yup";
import axios from "axios";
import BACKEND_URL from "@/global";

const NewDiscussion = () => {
	const [title, setTitle] = useState("");
	const [authors, setAuthors] = useState<string[]>([]);
	const [source, setSource] = useState("");
	const [pubYear, setPubYear] = useState<number>(0);
	const [journal, setJournal] = useState("");
	const [method, setMethod] = useState("");
	const [claim, setClaim] = useState("");
	const [result, setResult] = useState("");
	const [research, setResearch] = useState("");
	const [participant, setParticipant] = useState("");
	const [status, setStatus] = useState("");

	const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
		setResult("Unclear");
		setStatus("Submitted");
		event.preventDefault();
		console.log(
			JSON.stringify({
				title,
				authors,
				source,
				pubYear,
				journal,
				method,
				claim,
				result,
				research,
				participant,
			})
		);

		axios.post(`${BACKEND_URL}/user/submit`, {
			title: title,
			authors: authors,
			year: pubYear,
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
				<label htmlFor="pubYear">Publication Year:</label>
				<input
					className={formStyles.formItem}
					type="number"
					name="pubYear"
					id="pubYear"
					value={pubYear}
					onChange={(event) => {
						const val = event.target.value;
						if (val === "") {
							setPubYear(0);
						} else {
							setPubYear(parseInt(val));
						}
					}}
				/>
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
				<label htmlFor="method">Select Method:</label>
				<select id="method" name="method" onChange={(event) => {setMethod(event.target.value)}}>
					<option value="volvo">TDD</option>
					<option value="saab">Mob Progarmming</option>
					<option value="fiat">Automated Testing</option>
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
				<label htmlFor="participant">Reseach Participant type:</label>
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
				<button className={formStyles.formItem} type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default NewDiscussion;