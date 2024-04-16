import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker'
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/Row"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/Form"
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import "react-datepicker/dist/react-datepicker.css"

const Add = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        name: '',
        dob: '',
        gender: '',
        address: '',
        faculty: '',
        image: '',
    })

    const [date, setDate] = useState()

    const [faculty, setFaculty] = useState([])

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await axios.get(`${apiUrl}/faculty/`);
                console.log(res.data)
                setFaculty(res.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchFaculty();
    }, [])

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/student/add`)
                .then(res => console.log(res))
        } catch (error) {
            console.log(error)
        }
    }
    return (

        <div className="container add">
            <h1>Add Component</h1>


            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <FloatingLabel label="Email" >
                            <Form.Control type="email" placeholder="Email" onChange={handleChange} name="email" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword">
                        <FloatingLabel label="Password" >
                            <Form.Control type="password" placeholder="Password" onChange={handleChange} name="password" />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <FloatingLabel label="Name" className="mb-3" >
                    <Form.Control type="text" placeholder="Name" />
                </FloatingLabel>



                <Form.Select aria-label="Default select example" className="mb-3" name="gender">
                    <option>-Choose Gender-</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                </Form.Select>
                <FloatingLabel label="Address" className="mb-3" >
                    <Form.Control type="text" placeholder="Address" onChange={handleChange} name="address" />
                </FloatingLabel>
                <Form.Select aria-label="Default select example" className="mb-3" onChange={(handleChange)} name="faculty">
                    <option>-Choose Faculty-</option>
                    {
                        faculty.map((faculty) => {
                            return (
                                <option key={faculty._id}>{faculty.name}</option>
                            )
                        })
                    }
                </Form.Select>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formFile" >
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" name="image" />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Date of birth</Form.Label>
                        <br />
                        <DatePicker selected={date} onChange={date => setDate(date)} />
                    </Form.Group>
                </Row>

                <Button className="appButton">Add</Button>
            </Form>

        </div>
    );
};

export default Add;
