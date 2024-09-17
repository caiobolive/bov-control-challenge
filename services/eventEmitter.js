import { EventEmitter } from 'fbemitter';

const emitter = new EventEmitter();

export const events = {
  CHECKLIST_CREATED: 'checklistCreated',
};

export default emitter;