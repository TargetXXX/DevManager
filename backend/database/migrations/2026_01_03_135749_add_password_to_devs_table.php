<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('devs', function (Blueprint $table) {
            $table->string('email')->unique()->after('nome');
            $table->string('senha')->unique()->after('email');
            $table->boolean('first_login')->default(true)->after('senha');
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devs', function (Blueprint $table) {
            $table->dropColumn(['email', 'senha', 'first_login']);
        });
    }
};
