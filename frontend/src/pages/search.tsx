import { useState } from "react";
import formStyles from "../styles/Form.module.scss";
const SearchPage = () => {
    const [pubYear, setPubYear] = useState<number>(0);
    return(
        <div className ="container">
            <h1>Search for Articles</h1>
            <form className={formStyles.dropDown}>
                <label htmlFor="method">Select Method:</label>
                <select id="methods" name="cars">
                    <option value="TDD">TDD</option>
                    <option value="Mob Programming">Mob Programming</option>
                    <option value="Automated Testing">Automated Testing</option>
                </select>

                <label htmlFor="year">Select Publication Year:</label>
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
                <button className={formStyles.formItem} type="submit">
					Submit
				</button>

            </form>


        </div>
    
    );

};
export default SearchPage;