import { useEffect, useState } from "react";
import JobDetailView from "../../components/Job/JobDetailView";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { useJobStore } from "../../store/JobStore";
import { useApplicationStore } from "../../store/ApplicationStore";
import JobListTile from "../../components/Job/JobListTile";
import { Button, Select, MenuItem, FormControl, InputLabel, Tooltip } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();

  const updateName = useUserStore((state) => state.updateName);
  const updateEmail = useUserStore((state) => state.updateEmail);
  const updatePassword = useUserStore((state) => state.updatePassword);
  const updateAddress = useUserStore((state) => state.updateAddress);
  const updateRole = useUserStore((state) => state.updateRole);
  const updateDob = useUserStore((state) => state.updateDob);
  const updateSkills = useUserStore((state) => state.updateSkills);
  const updatePhonenumber = useUserStore((state) => state.updatePhonenumber);
  const updateId = useUserStore((state) => state.updateId);
  const updateAvailability = useUserStore((state) => state.updateAvailability);
  const updateGender = useUserStore((state) => state.updateGender);
  const updateHours = useUserStore((state) => state.updateHours);
  const updateIsLoggedIn = useUserStore((state) => state.updateIsLoggedIn);
  const updateResume = useUserStore((state) => state.updateResume);
  const updateResumeId = useUserStore((state) => state.updateResumeId);

  const role = useUserStore((state) => state.role);
  const managerId = useUserStore((state) => state.id);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);

  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );

  const applicationList: Application[] = useApplicationStore(
    (state) => state.applicationList
  );

  const [displayList, setDisplayList] = useState<Job[]>([]);
  const [jobStatusFilter, setJobStatusFilter] = useState("all"); // For manager's job filter
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("all"); // For applicant's status filter

  useEffect(() => {
    const token: string = localStorage.getItem("token")!;
    if (!token) {
      navigate("/login");
    }
    if (token) {
      const tokenInfo = token.split(".");
      const userInfo = JSON.parse(atob(tokenInfo[1]));

      updateName(userInfo.name);
      updateEmail(userInfo.email);
      updatePassword(userInfo.password);
      updateAddress(userInfo.address);
      updateRole(userInfo.role);
      updateDob(userInfo.dob);
      updateSkills(userInfo.skills);
      updatePhonenumber(userInfo.phonenumber);
      updateId(userInfo._id);
      updateAvailability(userInfo.availability);
      updateGender(userInfo.gender);
      updateHours(userInfo.hours);
      updateIsLoggedIn(true);
      updateResume(userInfo.resume);
      updateResumeId(userInfo.resumeId);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/fetchapplications")
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching applications");
          return;
        }
        updateApplicationList(res.data.application as Application[]);
      });

    axios
      .get("http://localhost:8000/api/v1/users", {
        params: { page: 1, limit: 25 },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching jobs");
          return;
        }
        updateJobList(res.data.jobs as Job[]);
      });
  }, []);

  useEffect(() => {
    let temp: Job[] = jobList;

    if (role === "Manager") {
      // Filter jobs based on manager and job status
      temp = temp.filter((item) => item.managerid === managerId);
      if (jobStatusFilter !== "all") {
        temp = temp.filter((job) =>
          jobStatusFilter === "open" ? job.status === "open" : job.status === "closed"
        );
      }
    } else if (role === "Applicant") {
      // Filter applications specific to the current user and status
      let applicantsJobs: Application[] = applicationList.filter(
        (item) => item.applicantid === managerId // Filters for the current applicant's applications
      );

      if (applicationStatusFilter !== "all") {
        applicantsJobs = applicantsJobs.filter((app) => {
          if (applicationStatusFilter === "accepted") return app.status === "accepted";
          if (applicationStatusFilter === "rejected") return app.status === "rejected";
          return true;
        });
      }

      // Map filtered applications to jobs
      const jobIds = applicantsJobs.map((app) => app.jobid);
      temp = temp.filter((job) => jobIds.includes(job._id));
    }

    setDisplayList(temp);
  }, [role, jobList, applicationList, jobStatusFilter, applicationStatusFilter]);

  const handleJobStatusFilterChange = (event) => {
    setJobStatusFilter(event.target.value);
  };

  const handleApplicationStatusFilterChange = (event) => {
    setApplicationStatusFilter(event.target.value);
  };

  return (
    <>
      <div className="content bg-slate-50 p-4">
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <div className="w-4/12 pt-2 overflow-x-hidden overflow-y-scroll bg-white/60 px-9 rounded-lg shadow-md">
            {/* Filter Dropdowns */}
            {role === "Manager" && (
              <FormControl variant="outlined" size="small" className="mb-4" style={{ width: "100%" }}>
                <InputLabel>Job Status</InputLabel>
                <Select
                  value={jobStatusFilter}
                  onChange={handleJobStatusFilterChange}
                  label="Job Status"
                  style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
                >
                  <MenuItem value="all">All Jobs</MenuItem>
                  <MenuItem value="open">Open Jobs</MenuItem>
                  <MenuItem value="closed">Closed Jobs</MenuItem>
                </Select>
              </FormControl>
            )}
            {role === "Applicant" && (
              <FormControl variant="outlined" size="small" className="mb-4" style={{ width: "100%" }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={applicationStatusFilter}
                  onChange={handleApplicationStatusFilterChange}
                  label="Status"
                  style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
                >
                  <MenuItem value="all">All Applications</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            )}

            <div className="py-4 text-2xl font-medium">
              {role === "Manager" ? "My Listings" : "My Applications"}
            </div>

            {displayList?.map((job: Job) => {
              let action;

              if (role === "Manager") {
                action = "view-application";
              } else {
                const application = applicationList?.find(
                  (item) =>
                    item.jobid === job._id && item.status === "screening"
                );
                action = application ? "view-questionnaire" : "view-application";
              }

              return <JobListTile data={job} key={job._id} action={action} />;
            })}
          </div>
          <JobDetailView />
        </div>
      </div>

      {role === "Manager" && (
        <div className="fixed p-4 bottom-3 right-3">
          <Tooltip title="Create a new job listing" arrow>
            <Button
              onClick={(e) => {
                e.preventDefault();
                navigate("/createjob");
              }}
              type="button"
              className="text-white bg-red-500 hover:bg-red-600 transition-colors"
              style={{
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "18px",
                width: "250px",
              }}
              variant="contained"
            >
              Create Job +
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default Dashboard;
