import { useEffect, useState } from "react"
import { demoteUser, getUserProfilesWithRoles, promoteUser } from "../../managers/userProfileManager";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";


export const UserProfileList = () => {
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        getUserProfilesWithRoles().then(setUserProfiles);
    }, [])

    const promote = (id) => {
        promoteUser(id).then(() => {
            getUserProfilesWithRoles().then(setUserProfiles);
        });
    };

    const demote = (id) => {
        demoteUser(id).then(() => {
            getUserProfilesWithRoles().then(setUserProfiles);
        });
    };

    if (!userProfiles) {
        return null;
      }

    return (
        <div className="container">
            <h4 className="sub-menu">User Profiles</h4>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
              
                        <th>Email</th>
                      
                        <th>Roles</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userProfiles.map(up => (
                        <tr key={up.id}>
                            <th scope='row'>{up.id}</th>
                            <td>{`${up.firstName} ${up.lastName}`}</td>
                           
                            <td>{up.email}</td>
                       
                            <td>{up.roles}</td>
                            <td><Link to={`${up.id}`}><Button>Details</Button></Link></td>
                            <td>
                                {up.roles.includes("Admin") ? (
                                    <Button
                                        color="danger"
                                        onClick={() => {
                                            demote(up.identityUserId);
                                        }}
                                    >
                                        Demote
                                    </Button>
                                ) : (
                                    <Button
                                        color="success"
                                        onClick={() => {
                                            promote(up.identityUserId);
                                        }}
                                    >
                                        Promote
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )


}