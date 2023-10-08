import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { assignChore, getChoreById, unassignChore, updateChore } from "../../managers/choreManager.js";
import { Input, Label, Table } from "reactstrap";
import { getUserProfiles } from "../../managers/userProfileManager.js";

export const ChoreDetails = () => {
    const [chore, setChore] = useState(null);
    const [users, setUsers] = useState([]);

    const { choreId } = useParams();


    useEffect(() => {
        getChoreById(choreId).then(setChore);
        getUserProfiles().then(setUsers);

    }, [])

    const handleAssignOrUnassign = (event, user) => {
        const { checked } = event.target;

        const promise = checked
            ? assignChore(chore.id, user.id)
            : unassignChore(chore.id, user.id)
            
        promise.then(() => {
            getChoreById(chore.id).then(setChore);
        })
    }

    const checkedStatus = (user) => {
        for (const assignment of chore.choreAssignments) {
            if (assignment.userProfileId === user.id) {
                return true;
            }
        }

        return false;
    }

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
            <div>
                {chore.choreAssignments.length === 0 ?
                    (<p>No Current Assignee, Assign One Please : </p>) : (<p>You Can Change Current Assignee Down Below :</p>)}
                {
                    users.map((up) => (
                        <div key={`user--${up.id}`}>
                            <Input
                                type="checkbox"
                                style={{ margin: "0.2rem 0.75rem" }}
                                checked={checkedStatus(up)}
                                onChange={(e) => {
                                    handleAssignOrUnassign(e, up);
                                }}
                            />
                            <Label>{up.firstName} {up.lastName}</Label>
                        </div>
                    ))
                }
            </div>

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
                                <td>{new Date(cc.completedOn).toLocaleDateString()}</td>
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