# -*- encoding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Timesheet and Planning',
    'version': '1.0',
    'category': 'Hidden',
    'sequence': 50,
    'summary': 'Compare timesheets and plannings',
    'depends': ['timesheet_grid', 'project_forecast'],
    'description': """
Compare timesheets and plannings
================================

Better plan your future schedules by considering time effectively spent on old plannings

""",
    'data': [
        'report/timesheet_forecast_report_views.xml',
        'security/ir.model.access.csv',
        'data/project_timesheet_forecast_data.xml',
        'views/planning_report_views.xml',
        'views/project_forecast_views.xml',
        ],
    'demo': [
        'demo/project_timesheet_forecast_demo.xml',
    ],
    'auto_install': True,
    'license': 'LGPL-3',
    'uninstall_hook': '_uninstall_hook',
    'assets': {
        'web.assets_backend': [
            'project_timesheet_forecast/static/src/js/forecast_timesheet_gantt.js',
        ],
        'web.qunit_suite_tests': [
            'project_timesheet_forecast/static/tests/**/*',
        ],
    }
}
