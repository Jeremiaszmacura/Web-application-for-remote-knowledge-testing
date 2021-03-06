import { useState, useEffect } from 'react';

import ExamList from "../components/exams/ExamList";

const AllExamsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadedExams, setLoadedExams] = useState([]);

    const prepareDateTimeFormat = (exams) => {
        exams.forEach((exam) => {
            exam.startsAt = "date: " + exam.startsAt.replaceAll('-', '.')
            exam.startsAt = exam.startsAt.replaceAll('T', ', time: ')
            exam.startsAt = exam.startsAt.replaceAll('.000Z', '')
            exam.endsAt = "date: " + exam.endsAt.replaceAll('-', '.')
            exam.endsAt = exam.endsAt.replaceAll('T', ', time: ')
            exam.endsAt = exam.endsAt.replaceAll('.000Z', '')
        });
    };

    useEffect(() => {
        setIsLoading(true); 
        fetch(
            'http://localhost:4000/exams',
            {
                method: 'GET',
                credentials: 'include'
            }
        ).then((response) => {
            return response.json();
        }).then((data) => {
            const exams = [];

            for (const key in data) {
                const exam = {
                    id: key,
                    ...data[key]
                };

                exams.push(exam);
            }

            setIsLoading(false);
            prepareDateTimeFormat(exams);
            setLoadedExams(exams);
        });
    }, []);

    if(isLoading) {
        return (
            <section>
                <p>Loading...</p>
            </section>
        )
    }

    return (
        <section>
            <h1>All Tests</h1>
            <ExamList exams={loadedExams} />
        </section>
    );
}

export default AllExamsPage;