export class NotificationMessages {
    static getJobCompletionMessage(): { title: string; body: string } {
      return {
        title: 'Job Status',
        body: 'Your file has been successfully completed.',
      };
    }
  
    static getJobFailureMessage(): { title: string; body: string } {
      return {
        title: 'Job Status',
        body: 'Your file has failed. Please try again.',
      };
    }
  }
  