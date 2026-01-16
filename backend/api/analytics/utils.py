from datetime import datetime, timedelta
from django.db.models import Avg, Sum, Count, Q
from django.utils import timezone
from api.progress.models import Progress, LessonCompletion, CodingExerciseSubmission
from api.assessments.models import AssessmentSubmission
from api.courses.models import Course
from api.lessons.models import Lesson


def calculate_student_analytics(user):
    """Calculate comprehensive analytics for a student."""
    
    # Get all progress records
    progress_records = Progress.objects.filter(user=user)
    
    # Total time spent across all courses
    total_time_spent = progress_records.aggregate(total=Sum('time_spent'))['total'] or 0
    
    # Course completion stats
    total_courses = progress_records.count()
    completed_courses = sum(1 for p in progress_records if p.lessons_completed == p.total_lessons and p.total_lessons > 0)
    
    # Assessment stats
    assessment_submissions = AssessmentSubmission.objects.filter(user=user)
    avg_assessment_score = assessment_submissions.aggregate(avg=Avg('percentage'))['avg'] or 0
    total_assessments = assessment_submissions.count()
    
    # Coding exercise stats
    coding_submissions = CodingExerciseSubmission.objects.filter(user=user)
    total_coding_exercises = coding_submissions.values('exercise').distinct().count()
    
    # Calculate coding success rate
    if coding_submissions.exists():
        successful_submissions = coding_submissions.filter(passed_tests=coding_submissions[0].total_tests).count()
        coding_success_rate = (successful_submissions / coding_submissions.count() * 100) if coding_submissions.count() > 0 else 0
    else:
        coding_success_rate = 0
    
    # Learning streak calculation
    lesson_completions = LessonCompletion.objects.filter(user=user).order_by('-completed_at')
    streak = calculate_learning_streak(lesson_completions)
    
    # Recent activity (last 7 days)
    seven_days_ago = timezone.now() - timedelta(days=7)
    recent_lessons = LessonCompletion.objects.filter(user=user, completed_at__gte=seven_days_ago).count()
    recent_assessments = AssessmentSubmission.objects.filter(user=user, submitted_at__gte=seven_days_ago).count()
    recent_coding = CodingExerciseSubmission.objects.filter(user=user, submitted_at__gte=seven_days_ago).count()
    
    return {
        'total_time_spent': total_time_spent,
        'total_courses': total_courses,
        'completed_courses': completed_courses,
        'avg_assessment_score': round(avg_assessment_score, 2),
        'total_assessments': total_assessments,
        'total_coding_exercises': total_coding_exercises,
        'coding_success_rate': round(coding_success_rate, 2),
        'learning_streak': streak,
        'recent_activity': {
            'lessons': recent_lessons,
            'assessments': recent_assessments,
            'coding_exercises': recent_coding,
        }
    }


def calculate_learning_streak(lesson_completions):
    """Calculate consecutive days of learning activity."""
    if not lesson_completions.exists():
        return 0
    
    streak = 0
    current_date = timezone.now().date()
    
    # Get unique completion dates
    completion_dates = set(lc.completed_at.date() for lc in lesson_completions)
    
    # Count consecutive days backwards from today
    while current_date in completion_dates:
        streak += 1
        current_date -= timedelta(days=1)
    
    return streak


def calculate_course_analytics(course):
    """Calculate analytics for a specific course (instructor view)."""
    
    # Get all progress records for this course
    progress_records = Progress.objects.filter(course=course)
    
    # Enrollment stats
    total_students = progress_records.count()
    
    # Completion stats
    completed_students = sum(1 for p in progress_records if p.lessons_completed == p.total_lessons and p.total_lessons > 0)
    completion_rate = (completed_students / total_students * 100) if total_students > 0 else 0
    
    # Average progress
    avg_progress = progress_records.aggregate(
        avg_lessons=Avg('lessons_completed'),
        avg_assessments=Avg('assessments_completed')
    )
    
    # Assessment stats for this course
    assessments = course.assessments.all()
    assessment_submissions = AssessmentSubmission.objects.filter(assessment__in=assessments)
    avg_assessment_score = assessment_submissions.aggregate(avg=Avg('percentage'))['avg'] or 0
    
    # Coding exercise stats
    exercises = course.exercises.all()
    coding_submissions = CodingExerciseSubmission.objects.filter(exercise__in=exercises)
    
    # Time spent stats
    avg_time_spent = progress_records.aggregate(avg=Avg('time_spent'))['avg'] or 0
    total_time_spent = progress_records.aggregate(total=Sum('time_spent'))['total'] or 0
    
    # Most/least engaged students
    engaged_students = progress_records.order_by('-time_spent')[:5]
    
    return {
        'total_students': total_students,
        'completed_students': completed_students,
        'completion_rate': round(completion_rate, 2),
        'avg_lessons_completed': round(avg_progress['avg_lessons'] or 0, 2),
        'avg_assessments_completed': round(avg_progress['avg_assessments'] or 0, 2),
        'avg_assessment_score': round(avg_assessment_score, 2),
        'total_assessments': assessments.count(),
        'total_coding_exercises': exercises.count(),
        'total_coding_submissions': coding_submissions.count(),
        'avg_time_spent': round(avg_time_spent, 2),
        'total_time_spent': total_time_spent,
        'most_engaged_students': [
            {
                'username': p.user.username,
                'time_spent': p.time_spent,
                'lessons_completed': p.lessons_completed,
            }
            for p in engaged_students
        ]
    }


def calculate_instructor_analytics(instructor):
    """Calculate analytics for all courses taught by an instructor."""
    
    courses = Course.objects.filter(instructor=instructor)
    
    total_students = 0
    total_courses = courses.count()
    course_analytics = []
    
    for course in courses:
        analytics = calculate_course_analytics(course)
        total_students += analytics['total_students']
        course_analytics.append({
            'course_id': course.id,
            'course_title': course.title,
            **analytics
        })
    
    return {
        'total_courses': total_courses,
        'total_students': total_students,
        'courses': course_analytics
    }


def calculate_system_analytics():
    """Calculate system-wide analytics (admin view)."""
    
    from django.contrib.auth.models import User
    
    # User stats
    total_users = User.objects.count()
    total_students = User.objects.filter(profile__role='student').count()
    total_instructors = User.objects.filter(profile__role='instructor').count()
    total_admins = User.objects.filter(profile__role='admin').count()
    
    # Course stats
    total_courses = Course.objects.count()
    total_lessons = Lesson.objects.count()
    
    # Activity stats
    total_lesson_completions = LessonCompletion.objects.count()
    total_assessment_submissions = AssessmentSubmission.objects.count()
    total_coding_submissions = CodingExerciseSubmission.objects.count()
    
    # Average scores
    avg_assessment_score = AssessmentSubmission.objects.aggregate(avg=Avg('percentage'))['avg'] or 0
    
    # Recent activity (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_users = User.objects.filter(last_login__gte=thirty_days_ago).count()
    recent_lesson_completions = LessonCompletion.objects.filter(completed_at__gte=thirty_days_ago).count()
    recent_assessments = AssessmentSubmission.objects.filter(submitted_at__gte=thirty_days_ago).count()
    
    # Most popular courses
    popular_courses = Course.objects.annotate(
        student_count=Count('progress')
    ).order_by('-student_count')[:5]
    
    return {
        'total_users': total_users,
        'total_students': total_students,
        'total_instructors': total_instructors,
        'total_admins': total_admins,
        'total_courses': total_courses,
        'total_lessons': total_lessons,
        'total_lesson_completions': total_lesson_completions,
        'total_assessment_submissions': total_assessment_submissions,
        'total_coding_submissions': total_coding_submissions,
        'avg_assessment_score': round(avg_assessment_score, 2),
        'recent_active_users': recent_users,
        'recent_lesson_completions': recent_lesson_completions,
        'recent_assessments': recent_assessments,
        'popular_courses': [
            {
                'id': course.id,
                'title': course.title,
                'student_count': course.student_count,
            }
            for course in popular_courses
        ]
    }


def get_progress_over_time(user, days=30):
    """Get lesson completion progress over time."""
    
    start_date = timezone.now() - timedelta(days=days)
    completions = LessonCompletion.objects.filter(
        user=user,
        completed_at__gte=start_date
    ).order_by('completed_at')
    
    # Group by date
    daily_progress = {}
    for completion in completions:
        date_key = completion.completed_at.date().isoformat()
        daily_progress[date_key] = daily_progress.get(date_key, 0) + 1
    
    return [
        {'date': date, 'count': count}
        for date, count in sorted(daily_progress.items())
    ]


def get_assessment_scores_over_time(user):
    """Get assessment scores over time."""
    
    submissions = AssessmentSubmission.objects.filter(user=user).order_by('submitted_at')
    
    return [
        {
            'date': submission.submitted_at.date().isoformat(),
            'score': submission.percentage,
            'assessment': submission.assessment.title,
        }
        for submission in submissions
    ]
