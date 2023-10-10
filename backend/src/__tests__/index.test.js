import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Test', () => {
    it('renders a heading', () => {
        render(<h1>Hello world!</h1>)

        const heading = screen.getByRole('heading', {
            name: /Hello world!/i,
        })

        expect(heading).toBeInTheDocument();
    })
})