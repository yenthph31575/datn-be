  // ========================= RESET PASSWORD =========================
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200 })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<unknown> {
    return this.authService.resetPassword(
      dto.token,
      dto.newPassword,
    );
  }
}
