import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { assignChore, getChoreById, unassignChore, updateChore } from "../../managers/choreManager.js";
import { Table } from "reactstrap";

export const ChoreDetails = () => {
    const [chore, setChore] = useState(null);

    const { choreId } = useParams();


    useEffect(() => {
        getChoreById(choreId).then(setChore);

    }, [])

    if (!chore) {
        return null;
    }

    return (
        <div className="container">


            <h2 className="sub-menu">{chore.name}</h2>
            <Table>
                <tbody>
                    <tr>
                        <th scope="row">Difficulty (1 - 5)</th>
                        <td>

                            {chore.difficulty}

                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Frequency in days (1 - 14)</th>
                        <td>

                            {chore.choreFrequencyDays}

                        </td>
                    </tr>
                </tbody>
            </Table>

            <h5 className="sub-menu">Current Assignee</h5>
            {chore.choreAssignments.length !== 0 ?
                (<Table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chore.choreAssignments.map((ca) => (
                            <tr key={`choreAssignments--${ca.id}`}>
                                <td>{ca.userProfile.firstName}</td>
                                <td>{ca.userProfile.lastName}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>) : (<p>No Current Assignee</p>)}

            <h5 className="sub-menu">Most Recent Completion</h5>
            {chore.choreCompletions.length !== 0 ?
                (<Table>
                    <thead>
                        <tr>
                            <th>Date Completed</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chore.choreCompletions.map((cc) => (
                            <tr key={`choreCompletion--${cc.id}`}>
                                <td>{new Date(cc.completedOn).toDateString()}</td>
                                <td>
                                    {cc?.userProfile?.firstName || cc?.userProfile?.lastName || 'N/A'}
                                    {/* if cc.userProfile.firstName is falsy (null or undefined), it checks cc.userProfile.lastName. If both are falsy, it displays "N/A." If either cc.userProfile.firstName or cc.userProfile.lastName is truthy (not null or undefined), it displays the respective value. */}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>) : (<p>No Recent Completion</p>)}
        </div>
    )
}