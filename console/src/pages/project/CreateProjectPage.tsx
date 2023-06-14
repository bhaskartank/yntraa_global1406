import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import modalRedux from "store/modules/modal";
import projectRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateProject from "components/templates/project/CreateProject";

import { appRoutes, pageTitles } from "utils/constants";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createProject = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Project",
            description: "Are you sure you want to create this project?",
            onConfirm: async () => {
              try {
                await dispatch(projectRedux.actions.createProject(payload));
                navigate(appRoutes.PROJECT);
              } catch (err) {
                console.error(err);
              }
            },
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const handleCancel = useCallback(() => {
    dispatch(
      modalRedux.actions.open({
        title: "Create Project",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.PROJECT),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_PROJECT}>
      <CreateProject onSubmit={createProject} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateProjectPage;
