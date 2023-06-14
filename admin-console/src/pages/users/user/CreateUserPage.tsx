import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateUser from "components/templates/users/user/CreateUser";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(usersRedux.actions.createUser(payload));
        navigate("/users/all-users");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  return (
    <PageContainer title="Create User" breadcrumbs={[{ label: "All Users", to: "/users/all-users" }, { label: "Create User" }]}>
      <CreateUser handleCreate={handleCreate} />
    </PageContainer>
  );
};

export default CreateUserPage;
