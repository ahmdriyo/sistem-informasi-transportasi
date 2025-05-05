const prefix = '/api'

export enum RestEndpoint {
  // USER DELETE
  DeleteUser = `${prefix}/v1/users/{idUser}`,

  // AUTH
  PostAuthGoogleLogin = `${prefix}/v1/auth/google-login-code`,
  PostAuthKakaoLogin = `${prefix}/v1/auth/kakao-login`,
  PostAuthNaverLogin = `${prefix}/v1/auth/naver-login`,
  PostAuthAppleLogin = `${prefix}/v1/auth/apple-login`,

  // PHONE NUMBER
  PostPhoneNumberCheck = `${prefix}/v1/phone-number-check`,
  PostAddPhoneNumber = `${prefix}/v1/add-phone-number`,

  // NICKNAME
  PostNicknameCheck = `${prefix}/v1/nickname-check`,
  PutUpdateNickname = `${prefix}/v1/update-nickname`,

  // FIND ACCOUNT
  PostFindAccount = `${prefix}/v1/find-account`,

  // PACKAGE OVERVIEW
  GetPackageOverView = `${prefix}/v1/package/overview`,
  GetRecentLearning = `${prefix}/v1/recent-learning`,

  // RESOURCE OVERVIEW
  GetResourceOverView = `${prefix}/v1/resource/overview`,
  GetResourceOverViewDetail = `${prefix}/v1/resource/overview/{idResourceDetail}`,
  GetResourceDownload = `${prefix}/v1/resource/download`,

  // BOOKMARK THEORY
  PostBookMarkTheory = `${prefix}/v1/resource/bookmark/{idResourceDetail}`,
  GetBookMarkTheoryStatus = `${prefix}/v1/resource/bookmark-status/{idResourceDetail}`,

  // PACKAGE OVERVIEW
  GetUserOverView = `${prefix}/v1/user/overview`,

  // MY PROFILE
  GetUserProfile = `${prefix}/v1/user/profile`,
  GetDailyLearing = `${prefix}/v1/user/daily-learning`,
  GetSolvedProblemsUser = `${prefix}/v1/user/solved-problems`,
  GetActivityUserByDate = `${prefix}/v1/user-activity`,
  GetHistoryPracticeAnswer = `${prefix}/v1/user/practice-history`,
  GetBookmarksUser = `${prefix}/v1/user/bookmarks`,
  DeleteProgressReset = `${prefix}/v1/user/reset/{idLearningTopic}`,

  // Folder
  GetFolder = `${prefix}/v1/folder`,
  PostFolder = `${prefix}/v1/folder`,
  PutFolder = `${prefix}/v1/folder/{idFolder}`,
  DeleteFolder = `${prefix}/v1/folder/{idFolder}`,

  //QUESTION MARK
  GetQuestionMark = `${prefix}/v1/problem-status/all-problems`,
  PostQuestionMark = `${prefix}/v1/problem`,
  DeleteQuestionMark = `${prefix}/v1/problem-delete/{idProblemTheory}`,

  // Note
  GetNote = `${prefix}/v1/notes`,
  PostNote = `${prefix}/v1/notes`,
  PostNoteDraw = `${prefix}/v1/notes/draw`,
  PutNote = `${prefix}/v1/notes/{idNote}`,
  DeleteNote = `${prefix}/v1/notes/{idNote}`,

  // Study Time Reminders
  GetStudyTimeReminders = `${prefix}/v1/study-reminders`,
  PutStudyTimeReminders = `${prefix}/v1/study-reminders/{idUserStudyReminder}`,

  // MEMO
  GetMemo = `${prefix}/v1/memo-status/all-notes`,
  PostMemo = `${prefix}/v1/memo`,
  PostMemoDraw = `${prefix}/v1/memo/draw`,
  DeleteMemo = `${prefix}/v1/memo-delete/{idMemo}`,

  // TOPIC
  GetTopicDetail = `${prefix}/v1/topic/{idLearningTopic}`,

  // UPLOAD IMAGE
  PostUploadImage = `${prefix}/v1/upload-image`,

  // SUB TOPIC
  GetSubtopicTheoryModulDetail = `${prefix}/v1/subtopic/module-theory/{idTheoryModul}`,
  GetSubtopicQuestion = `${prefix}/v1/subtopic/{idLearningSubtopic}/questions/{idPracticeTheory}`,
  GetCorrectAnswer = `${prefix}/v1/correct-answer/{idPracticeTheory}`,
  PostScratchedOption = `${prefix}/v1/scratched-option/{idAnswerOption}`,
  PostSubmitAnswers = `${prefix}/v1/submit-answers/{idPracticeTheory}`,
  PostAnnotation = `${prefix}/v1/annotation`,
  PostAnnotationDraw = `${prefix}/v1/annotation/draw`,

  // FLASHCARD
  GetFlashcard = `${prefix}/v1/flashcards`,
  PostFlashcard = `${prefix}/v1/flashcards`,
  PutFlashcard = `${prefix}/v1/flashcards/{idFlashCard}`,
  DeleteFlashcard = `${prefix}/v1/flashcards/{idFlashCard}`,
  PatchFlashcardRestore = `${prefix}/v1/flashcards/{idFlashCard}/restore`,

  // FLASHCARD DETAIL
  GetFlashcardDetail = `${prefix}/v1/detail-flashcards/{idFlashCard}`,
  PostFlashcardDetail = `${prefix}/v1/detail-flashcards/{idFlashCard}`,
  PutFlashcardDetail = `${prefix}/v1/detail-flashcards/{idDetailFlashCard}`,
  DeleteFlashcardDetail = `${prefix}/v1/detail-flashcards/{idDetailFlashCard}`,
  PatchFlashcardDetailRestore = `${prefix}/v1/detail-flashcards/{idDetailFlashCard}/restore`,
  GetReviewFlashcard = `${prefix}/v1/view-detail-flashcard`,
  GetFlashcardDeleted = `${prefix}/v1/deleted-detail-flashcard`,
  DeleteFlashcardHard = `${prefix}/v1/hard-delete-detail-flashcards/{idDetailFlashCard}`,

  //EXAM
  GetTopicList = `${prefix}/v1/list-topic`,
  PostSubTopicList = `${prefix}/v1/list-subtopic`,
  PostTimeLimit = `${prefix}/v1/time-limit-exam`,
  PostRealExam = `${prefix}/v1/exam/real-test`,
  PostSelfExam = `${prefix}/v1/exam/self-test`,
  GetNumberOfQuestion = `${prefix}/v1/exam/{idExam}/total-questions`,
  GetQuestionByExam = `${prefix}/v1/exam/{idExam}/question/{idExamQuestion}`,
  PostSubmitAnswerExam = `${prefix}/v1/submit-answers-exam/{idExamQuestion}`,
  PostExamFinished = `${prefix}/v1/exam/end`,
  PostExamScratchedOption = `${prefix}/v1/question/{idExamQuestion}/scratched-option/{idAnswerOption}`,
  GetExamReport = `${prefix}/v1/exam/report/{idExam}`,
  GetExamAll = `${prefix}/v1/exam`,
  PostExamRetake = `${prefix}/v1/exam/retake/{idExam}`,
  DeleteExam = `${prefix}/v1/exam/{idExam}`,

  //PAYMENT
  GetPaymentAvailablePackages = `${prefix}/v1/available-packages`,
  GetDetailTransaction = `${prefix}/v1/detail-transaction/{orderId}`,
  PostPaymentCheckoutPackage = `${prefix}/v1/checkout-package`,
  PostPaymentCheckoutPackageFree = `${prefix}/v1/checkout-free-package`,

  //PAYMENT CONFRIM
  PostPaymentConfirm = `https://api.tosspayments.com/v1/payments/confirm`,

  //COUPONS
  GetCoupons = `${prefix}/v1/coupons`,

  //Quiz
  GetQuiz = `${prefix}/v1/quiz/{idQuiz}/question/{idQuizNext}`,
  GetQuizHistory = `${prefix}/v1/quiz/history`,
  PostQuiz = `${prefix}/v1/quiz/daily`,
  PostSumbitQuiz = `${prefix}/v1/quiz/submit/{idQuizQuestion}`,
  PostQuizFinished = `${prefix}/v1/quiz/end`,

  // REPORT
  PostReport = `${prefix}/v1/report`,

  // Activity End
  PostActivityEnd = `${prefix}/v1/activity/end`,

  // PROBLEM
  PostProblem = `${prefix}/v1/problem`,
  DeleteProblem = `${prefix}/v1/problem-delete/{idProblemTheory}`,

  // LEARNING SEARCH
  GetLearningSearch = `${prefix}/v1/search`,

  //NOTIFICATION
  GetTodayNotification = `${prefix}/v1/notification`,
  GetPrevNotification = `${prefix}/v1/notification/previous`,
  PutMarkAsRead = `${prefix}/v1/notification/mark-as-read/{idNotification}`,
  PutMarkAllToday = `${prefix}/v1/notification/mark-today`,
  PutMarkAllPrev = `${prefix}/v1/notification/mark-previous`,
}

export interface GetPathProps {
  endpoint: RestEndpoint
  ids?: Record<string, string | number>
  query?: Record<string, string | number>
}
export namespace RestEndpoint {
  /*
   * @param endpoint - RestEndpoint
   * @param ids - Record<string, string | number>. Key name is needed to be the same as the placeholder in the endpoint.
   * @returns string
   */
  export function getPath({ endpoint, ids, query }: GetPathProps): string {
    let path: RestEndpoint | string = endpoint

    if (ids) {
      for (const [key, value] of Object.entries(ids)) {
        const placeholder = `{${key}}`
        path = path.replace(placeholder, String(value))
      }
    }

    if (path.includes('{')) {
      throw new Error('Missing required IDs for this endpoint.')
    }

    if (query) {
      const queryString = new URLSearchParams(query as Record<string, string>).toString()
      path += `?${queryString}`
    }

    return path
  }
}
