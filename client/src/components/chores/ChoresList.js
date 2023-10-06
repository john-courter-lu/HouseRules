import { useEffect, useState } from "react";
import { Button, Table, Toast, ToastBody, ToastHeader } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { completeChore, deleteChore, getChores } from "../../managers/choreManager.js";

export const ChoresList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([]);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getChores().then(setChores);
    }, []);

    const handleDelete = (id) => {
        deleteChore(id).then(() => {
            navigate("/chores");
        });
    };

    const handleComplete = (id, userId, choreName) => {
        completeChore(id, userId).then(() => {
            setToastMessage(`Yay! ${choreName} completed by ${loggedInUser.firstName}!`);
            setToastOpen(true);
            // Automatically close the toast after 5 seconds
            setTimeout(() => {
                setToastOpen(false);
            }, 5000);

        });
    };

    return (
        <div className="container">
            <div className="sub-menu">
                <h4 style={{ margin: "0" }} >Chores</h4>
                {loggedInUser.roles.includes("Admin") && (
                    <Link to="/chores/create"> <Button>New Chore</Button></Link>
                )}
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Frequency</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {chores.map((c) => (
                        <tr key={`chores-${c.id}`}>
                            <th scope="row">{c.id}</th>

                            <td>{c.name}</td>

                            <td>{c.difficulty}</td>
                            <td>{c.choreFrequencyDays} Day(s)</td>
                            <td>
                                <Button
                                    color="success"
                                    onClick={() => {
                                        handleComplete(c.id, loggedInUser.id, c.name);
                                    }}
                                >
                                    Complete
                                </Button>
                            </td>

                            {loggedInUser?.roles.includes("Admin") && (
                                <>
                                    <td>
                                        <Link to={`${c.id}`}>
                                            <Button color="info">
                                                Details
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            color="danger"
                                            onClick={() => {
                                                handleDelete(c.id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Toast isOpen={toastOpen} className="position-fixed" style={{ top: "60px", left: "10px" }}>
                <ToastHeader icon="success">Success</ToastHeader>
                <ToastBody>{toastMessage}</ToastBody>
            </Toast>

        </div>
    )
}