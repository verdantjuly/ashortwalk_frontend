import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function MyGroup({ groups }) {
  const navigate = useNavigate();
  const token = window.sessionStorage.getItem("Authorization");
  const [loginId, setLoginId] = useState("");
  const handelUpdateButtonClick = (id) => {
    const dataToSend = { id };
    navigate(`/groups/${id}/update`, { state: dataToSend });
  };
  const handelDeleteButtonClick = (id) => {
    fetch(
      `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
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
      .catch((error) => {});
  };
  useState(() => {
    const fetchUserId = (id) => {
      fetch(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLoginId(data.id);
        })
        .catch((error) => {});
    };

    fetchUserId();
  }, []);

  return (
    <div className="">
      {groups.map((group) => {
        console.log(group.leaderUserId);
        console.log(loginId);
        return (
          <div className="">
            <h3>{group.groupName}</h3>
            {loginId === group.leaderUserId ? (
              <div>
                <button onClick={() => handelUpdateButtonClick(group.id)}>
                  수정
                </button>
                <button onClick={() => handelDeleteButtonClick(group.id)}>
                  삭제
                </button>
              </div>
            ) : (
              <></>
            )}
            <p>{group.description}</p>
            <p>{group.leaderNickname}</p>
          </div>
        );
      })}
    </div>
  );
}
