import React from "react";
import { useNavigate } from "react-router-dom";

export default function MyGroup({ groups }) {
    const navigate = useNavigate();
    const token = window.sessionStorage.getItem("Authorization");

    const handelUpdateButtonClick = (id) => {
        const dataToSend = { id };
        navigate(`/groups/${id}/update`, { state: dataToSend });
    }
    const handelDeleteButtonClick = (id) => {

        fetch(`http://localhost:8000/api/groups/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            }
        })
            .then((response) => {
                if (response.ok) {
                    alert("그룹삭제 완료되었습니다.");
                } else {
                    alert("그룹삭제 실패하였습니다.");
                }
                return response.json();
            })
            .then((data) => {
                window.location.href = "/group";
            })
            .catch((error) => { });
    }
    return (
        <div className="">
            {groups.map((group) => {
                return (
                    <div className="">
                        <h3>{group.groupName}</h3>
                        <button onClick={() => handelUpdateButtonClick(group.id)}>수정</button>
                        <button onClick={() => handelDeleteButtonClick(group.id)}>삭제</button>
                        <p>{group.description}</p>
                        <p>{group.leaderNickname}</p>
                    </div>
                );
            })}
        </div>
    );
}