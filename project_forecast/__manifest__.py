# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "Project Planning",
    'summary': """Plan your resources on project tasks""",
    'description': """
    Schedule your teams across projects and estimate deadlines more accurately.
    """,
    'category': 'Services/Project',
    'version': '1.0',
    'depends': ['project', 'planning', 'web_grid'],
    'demo': [
        'data/project_planning_demo.xml',
        'data/planning_demo.xml',
    ],
    'data': [
        'views/planning_report_views.xml',
        'views/planning_template_views.xml',
        'views/planning_templates.xml',
        'views/planning_views.xml',
        'views/project_forecast_views.xml',
        'views/project_views.xml',
        'report/planning_report_templates.xml',
    ],
    'license': 'LGPL-3',
    'post_init_hook': 'post_init',
    'uninstall_hook': '_uninstall_hook',
    'assets': {
        'web.assets_backend': [
            'project_forecast/static/src/js/forecast_gantt.js',
        ],
        'web.assets_frontend': [
            'project_forecast/static/src/js/forecast_calendar_front.js',
        ],
        'web.assets_tests': [
            'project_forecast/static/tests/tours/*',
        ],
    }
}
