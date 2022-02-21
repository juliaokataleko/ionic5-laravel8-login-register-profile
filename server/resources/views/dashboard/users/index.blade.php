@extends('layouts.app')


@section('content')
<div class="card">
    <div class="card-header">
        Usuários
    </div>
    <div class="card-body">
        <div class="table responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Código de Confirmação</th>
                        <th>Activo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>

                    @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->username }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->phone }}</td>
                        <td> {{ $user->confirmation_code }} </td>
                        <td>{{ $user->active }}</td>
                        <td>{{ $user->uuid }}</td>
                    </tr>
                    @endforeach

                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer">
        {{ $users->links() }}
    </div>
</div>

@endsection