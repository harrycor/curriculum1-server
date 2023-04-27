import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ChatComponent from "./chatRooms/ChatComponent";
import ChatRoom from "./chatRooms/ChatRoom";
import CreateChatRoomForm from "./chatRooms/CreateChatRoomForm";
import InviteUserToChatRoom from "./chatRooms/InviteUserToChatRoom";
import Home from "./Home";
import WrestlersView from "./HomeAKAWrestlersView/WrestlersView";
import Admin from "./adminPanel/Admin";

import NavigationBar from "./NavigationBar";

import Login from "./accountCreationLoginEtc/Login";
import CreateAccount from "./accountCreationLoginEtc/CreateAccount";
import ProfilePage from "./accountCreationLoginEtc/ProfilePage";
import Tests from "./other/Tests";
import AllGradesAllLevels from "./HomeAKAWrestlersView/allGradesAllLevels/AllGradesAllLevels";
import PasswordResetLandingPage from "./accountCreationLoginEtc/PasswordResetLandingPage";
import ShowAllLogins from "./other/ShowAllLogins";
import CreateTeamAccount from "./accountCreationLoginEtc/CreateTeamAccount";
import CoachesViewTwoPointO from "./CoachesViews/CoachesViewTwoPOintO";
import PlayLessonPlan from "./practicePlaylists/ForPracticePlaylistComponents/PlayLessonPlan";
import CreateAndEditPlan from "./practicePlaylists/ForPracticePlaylistComponents/CreateAndEditPlan";
import EditLessonPlan from "./practicePlaylists/ForPracticePlaylistComponents/EditLessonPlan";
import PlayLessonPlanStartPage from "./practicePlaylists/ForPracticePlaylistComponents/PlayLessonPlanStartPage";
import LessonsSchedulingStartPage from "./LessonsSchedulingPagesAndComponents/LessonsSchedulingStartPage";
import ServicesAndMerchandiseStart from "./payments/ServicesAndMerchandiseStart";
import ThankYouForYourPurchase from "./payments/ThankYouForYourPurchase";
import AccountStart from "./account/AccountStart";
import CheckInForPractices from "./payments/CheckInForPractices";
import MasterView from "./CoachesViews/newMasterView/MasterView";
import AutomatedServices from "./automatedServices/AutomatedServices";
import FilterWrestlers from "./adminPanel/findWrestler/FilterWrestlers";
import { ToastContainer } from "react-toastify";
import "./scss/reactToastify.scss";

const App = (props: AppProps) => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/userAccount">
            <AccountStart />
          </Route>
          <Route exact path="/coachesview">
            <CoachesViewTwoPointO />
          </Route>
          <Route exact path="/masterview">
            <MasterView />
          </Route>
          <Route exact path="/wrestlersview">
            <WrestlersView />
          </Route>
          <Route exact path="/profilepage">
            <ProfilePage />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/createAccount">
            <CreateAccount />
          </Route>
          <Route exact path="/createTeamAccount">
            <CreateTeamAccount />
          </Route>
          <Route exact path="/tests">
            <Tests />
          </Route>
          <Route exact path="/findpartners">
            <>
              <NavigationBar />
              <FilterWrestlers />
            </>
          </Route>
          <Route exact path="/AllGradesAllLevels">
            <AllGradesAllLevels />
          </Route>
          <Route exact path="/LessonsScheduling">
            <LessonsSchedulingStartPage />
          </Route>
          <Route exact path="/CreateALessonPlan">
            <CreateAndEditPlan />
          </Route>
          <Route exact path="/EditALessonPlan/:planId">
            <EditLessonPlan />
          </Route>
          <Route exact path="/PlayLessonPlan/:planId">
            <PlayLessonPlanStartPage />
          </Route>
          <Route exact path="/playEntireLessonPlan/:planId">
            <PlayLessonPlan />
          </Route>
          <Route exact path="/servicesAndMerchandise">
            <ServicesAndMerchandiseStart />
          </Route>
          <Route exact path="/thankYouForYourPurchase">
            <ThankYouForYourPurchase />
          </Route>
          <Route path="/passwordResetLandingPage/:encryptedIdInUrl">
            <PasswordResetLandingPage />
          </Route>
          <Route path="/ShowAllLogins">
            <ShowAllLogins />
          </Route>
          <Route path="/checkIns">
            <CheckInForPractices />
          </Route>
          <Route path="/automatedServices">
            <AutomatedServices />
          </Route>
          <Route path="/chat">
            <ChatComponent />
          </Route>
          <Route path="/chatroom/:chatRoomId">
            <ChatRoom />
          </Route>
          <Route path="/create/chatroom">
            <CreateChatRoomForm />
          </Route>
          <Route path="/invite/usertochatroom/:id">
            <InviteUserToChatRoom />
          </Route>
          <Route path="*">
            <h1>404 not found error, you probably went to the wrong page...</h1>
            <a href="/WrestlersView">Go back to the homepage!</a>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

interface AppProps {}

export default App;
