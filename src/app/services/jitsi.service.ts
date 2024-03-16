import { Injectable, OnInit } from '@angular/core';
import { User } from './../services/user';
declare var JitsiMeetExternalAPI: any;
import { Router } from '@angular/router'; // import router from angular router

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  api: any;
  user: User;
  namePrincipalRoom: String;
  options: any;
  domain: string = 'meet.jit.si';

  // For Custom Controls
  isAudioMuted = true;
  isVideoMuted = true;

  constructor(private route: Router) {
    this.user = new User();
    this.namePrincipalRoom = 'PrincipalRoom';
  }

  moveRoom(nameRoom: String): void {
    const myNode = document.getElementById('jitsi-iframe');
    if (myNode) {
        myNode.innerHTML = '';
    }

    console.log('nameRoom' + nameRoom);
    console.log('prejoinPageEnabled:' + (this.user.name != '' ? true : false));

    this.options = {
      roomName: nameRoom,
      width: 900,
      height: 500,

      configOverwrite: {
        prejoinPageEnabled: this.user.name != '' ? false : true,
      },
      interfaceConfigOverwrite: {
        startAudioMuted: true,
        startVideoMuted: true,
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name,
        email: 'Imarslanzafar@gmail.com',
      },
    };

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
      participantRoleChanged: this.participantRoleChanged,
      passwordRequired: this.passwordRequired,
      endpointTextMessageReceived: this.endpointTextMessageReceived,
    });
  }

  changeRouterLink(value: any) {
    console.log(value);
    this.namePrincipalRoom = value;

    const myNode = document.getElementById('jitsi-iframe');
    if (myNode) {
      myNode.innerHTML = '';
    }

    this.options = {
      roomName: this.namePrincipalRoom,
      width: 900,
      height: 500,
      configOverwrite: {
        prejoinPageEnabled: false,
        openBridgeChannel: 'datachannel',
      },
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name,
      },
    };
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }

  handleClose = () => {
    console.log('handleClose');
  };

  endpointTextMessageReceived = async (event: { data: { eventData: { text: string; }; }; }) => {
    console.log(event);
    console.log(event.data.eventData.text);
    if ((event.data.eventData.text = 'mover a principal')) {
      this.moveRoom('grupo 1');
    }
  };

  passwordRequired = async () => {
    console.log('passwordRequired'); 
    this.api.executeCommand('password', 'The Password');
  };

  handleParticipantLeft = async (participant: any) => {
    console.log('handleParticipantLeft', participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  };

  participantRoleChanged = async (participant: any) => {
    console.log('participantRoleChanged', participant);
    {
      console.log('participantRoleChanged:', participant.role);
      this.api.executeCommand('password', 'The Password');
    }
  };

  handleParticipantJoined = async (participant: any) => {
    console.log('OJOJOJOJ  handleParticipantJoined', participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
  };

  handleVideoConferenceJoined = async (participant: any) => {
    console.log('handleVideoConferenceJoined', participant);
    this.user.setName(participant.userNameTest);
    this.namePrincipalRoom = participant.roomName;
  };

  handleVideoConferenceLeft = () => {
    console.log('handleVideoConferenceLeft');
  };

  handleMuteStatus = (audio: any) => {
    console.log('handleMuteStatus', audio); // { muted: true }
  };

  handleVideoStatus = (video: any) => {
    console.log('handleVideoStatus', video); // { muted: true }
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  // custom events
  executeCommand(command: string) {
    this.api.executeCommand(command);
    if (command == 'hangup') {
      console.log("Thank you for attending call")
      return;
    }

    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }
}
