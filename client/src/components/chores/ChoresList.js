import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { deleteChore, getChores } from "../../managers/choreManager.js";

export const ChoresList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([]);

    const navigate = useNavigate();

    const handleDelete = (id) => {
        deleteChore(id).then(() => {
            navigate("/chores");
        })
    }

    useEffect(() => {
        getChores().then(setChores);
    }, [])



    return (
        <div className="container">
            <h4 className="sub-menu">Chores</h4>
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

                            {loggedInUser?.roles.includes("Admin") && (
                                <>
                                    <td>
                                        <Link to={`${c.id}`}>
                                            <Button color="info">Details</Button>
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

        </div>
    )
}